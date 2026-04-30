-- Table de liaison : une activité peut couvrir plusieurs niveaux scolaires

CREATE TABLE IF NOT EXISTS activity_grade_levels (
  id             bigserial PRIMARY KEY,
  activity_id    uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  grade_level_id int  NOT NULL REFERENCES grade_levels(id) ON DELETE CASCADE,
  UNIQUE (activity_id, grade_level_id)
);

ALTER TABLE activity_grade_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agl_select" ON activity_grade_levels FOR SELECT
  USING (activity_id IN (SELECT id FROM activities WHERE user_id = auth.uid()));

CREATE POLICY "agl_insert" ON activity_grade_levels FOR INSERT
  WITH CHECK (activity_id IN (SELECT id FROM activities WHERE user_id = auth.uid()));

CREATE POLICY "agl_delete" ON activity_grade_levels FOR DELETE
  USING (activity_id IN (SELECT id FROM activities WHERE user_id = auth.uid()));
