-- is_public flag on activities (for "ajouter à la banque" feature)
ALTER TABLE activities ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

-- Multiple links per activity
CREATE TABLE IF NOT EXISTS activity_links (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid        NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url         text        NOT NULL CHECK (url <> ''),
  label       text,
  sort_order  smallint    NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE activity_links ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "activity_links_user_all" ON activity_links
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "activity_links_public_read" ON activity_links
    FOR SELECT USING (
      activity_id IN (SELECT id FROM activities WHERE is_public = true)
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow any authenticated user to read public activities
DO $$ BEGIN
  CREATE POLICY "activities_public_read" ON activities
    FOR SELECT USING (is_public = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
