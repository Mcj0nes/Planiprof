-- Préscolaire observation grids
-- Tables: prescolaire_obs_grids, prescolaire_obs_students, prescolaire_obs_scores

CREATE TABLE prescolaire_obs_grids (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain      text        NOT NULL,
  etape       int,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE prescolaire_obs_grids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own prescolaire_obs_grids"
  ON prescolaire_obs_grids FOR ALL USING (auth.uid() = user_id);

CREATE TABLE prescolaire_obs_students (
  id          uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  grid_id     uuid  NOT NULL REFERENCES prescolaire_obs_grids(id) ON DELETE CASCADE,
  name        text  NOT NULL DEFAULT '',
  sort_order  int   NOT NULL DEFAULT 0
);
ALTER TABLE prescolaire_obs_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own prescolaire_obs_students"
  ON prescolaire_obs_students FOR ALL
  USING (EXISTS (
    SELECT 1 FROM prescolaire_obs_grids g
    WHERE g.id = grid_id AND g.user_id = auth.uid()
  ));

CREATE TABLE prescolaire_obs_scores (
  student_id  uuid NOT NULL REFERENCES prescolaire_obs_students(id) ON DELETE CASCADE,
  criterion   text NOT NULL,
  score       int  NOT NULL CHECK (score BETWEEN 1 AND 4),
  PRIMARY KEY (student_id, criterion)
);
ALTER TABLE prescolaire_obs_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own prescolaire_obs_scores"
  ON prescolaire_obs_scores FOR ALL
  USING (EXISTS (
    SELECT 1 FROM prescolaire_obs_students s
    JOIN prescolaire_obs_grids g ON g.id = s.grid_id
    WHERE s.id = student_id AND g.user_id = auth.uid()
  ));
