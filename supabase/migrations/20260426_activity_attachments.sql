-- Metadata table for activity file attachments
CREATE TABLE IF NOT EXISTS activity_attachments (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  template_id uuid REFERENCES activity_templates(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name   text NOT NULL,
  file_path   text NOT NULL,
  file_type   text,
  file_size   integer,
  created_at  timestamptz DEFAULT now()
);

-- Add template_id if table pre-existed without it
ALTER TABLE activity_attachments
  ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES activity_templates(id) ON DELETE CASCADE;

-- Make activity_id nullable (required so template-only attachments can be inserted)
DO $$ BEGIN
  ALTER TABLE activity_attachments ALTER COLUMN activity_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Add CHECK constraint (drop first so re-runs don't fail)
DO $$ BEGIN
  ALTER TABLE activity_attachments DROP CONSTRAINT att_has_source;
EXCEPTION WHEN undefined_object THEN NULL; END $$;
ALTER TABLE activity_attachments ADD CONSTRAINT att_has_source
  CHECK (activity_id IS NOT NULL OR template_id IS NOT NULL);

ALTER TABLE activity_attachments ENABLE ROW LEVEL SECURITY;

-- Policies (idempotent — skip silently if already exists)
DO $$ BEGIN
  CREATE POLICY "att_select" ON activity_attachments FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "att_insert" ON activity_attachments FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "att_delete" ON activity_attachments FOR DELETE USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Storage bucket for activity files (private, 50 MB per file)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'activity-files',
  'activity-files',
  false,
  52428800,
  ARRAY[
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS (idempotent)
DO $$ BEGIN
  CREATE POLICY "activity_files_select" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'activity-files');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "activity_files_insert" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'activity-files' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "activity_files_delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'activity-files' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
