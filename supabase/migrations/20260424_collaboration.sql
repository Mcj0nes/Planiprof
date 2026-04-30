-- ============================================================
-- PLANIPROF -- Collaboration: invitations and shared planning
-- ============================================================

-- Add collaboration mode to profiles (NULL = not yet onboarded)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS collaboration_mode text
  CHECK (collaboration_mode IN ('individual', 'collaborative'));

-- Pending invitations
CREATE TABLE IF NOT EXISTS collaboration_invitations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_email   text NOT NULL,
  invited_email text NOT NULL,
  status        text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at    timestamptz NOT NULL DEFAULT now() + interval '7 days',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Accepted collaborator relationships
CREATE TABLE IF NOT EXISTS user_collaborators (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collaborator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_email     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, collaborator_id)
);

ALTER TABLE collaboration_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collaborators ENABLE ROW LEVEL SECURITY;

-- Invitations: owner can CRUD; invited user can SELECT and UPDATE status
DO $$ BEGIN
  CREATE POLICY "collab_inv: owner" ON collaboration_invitations
    FOR ALL USING (owner_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "collab_inv: invited select" ON collaboration_invitations
    FOR SELECT USING (
      invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "collab_inv: invited update" ON collaboration_invitations
    FOR UPDATE USING (
      invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- user_collaborators: both parties can view; owner manages all
DO $$ BEGIN
  CREATE POLICY "user_collab: parties view" ON user_collaborators
    FOR SELECT USING (owner_id = auth.uid() OR collaborator_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "user_collab: owner all" ON user_collaborators
    FOR ALL USING (owner_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Annual plans: collaborators can SELECT and UPDATE (not delete)
DO $$ BEGIN
  CREATE POLICY "annual_plans: collab select" ON annual_plans
    FOR SELECT USING (
      user_id IN (
        SELECT owner_id FROM user_collaborators WHERE collaborator_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "annual_plans: collab update" ON annual_plans
    FOR UPDATE USING (
      user_id IN (
        SELECT owner_id FROM user_collaborators WHERE collaborator_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Plan assignments: collaborators have full access on collaborated plans
DO $$ BEGIN
  CREATE POLICY "plan_assignments: collab" ON plan_assignments
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM annual_plans ap
        JOIN user_collaborators uc ON uc.owner_id = ap.user_id
        WHERE ap.id = plan_assignments.annual_plan_id
          AND uc.collaborator_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;