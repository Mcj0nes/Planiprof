CREATE TABLE IF NOT EXISTS activities (
  id              uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           text    NOT NULL,
  description     text,
  subject_id      integer REFERENCES subjects(id) ON DELETE SET NULL,
  type_tag        text,
  duration_min    integer CHECK (duration_min > 0),
  grade_level_tag text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activities_select" ON activities FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "activities_insert" ON activities FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "activities_update" ON activities FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "activities_delete" ON activities FOR DELETE USING (user_id = auth.uid());

-- Junction table: activity <-> content items (multiple contenus par activité)
CREATE TABLE IF NOT EXISTS activity_content_items (
  activity_id     uuid    NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  content_item_id integer NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, content_item_id)
);

ALTER TABLE activity_content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "act_ci_select" ON activity_content_items FOR SELECT
  USING (activity_id IN (SELECT id FROM activities WHERE user_id = auth.uid()));
CREATE POLICY "act_ci_insert" ON activity_content_items FOR INSERT
  WITH CHECK (activity_id IN (SELECT id FROM activities WHERE user_id = auth.uid()));
CREATE POLICY "act_ci_delete" ON activity_content_items FOR DELETE
  USING (activity_id IN (SELECT id FROM activities WHERE user_id = auth.uid()));
