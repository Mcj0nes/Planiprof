-- ============================================================
-- PLANIPROF -- Grilles d'evaluation: schema
-- ============================================================

CREATE TABLE IF NOT EXISTS eval_grids (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  subject_id    int  REFERENCES subjects(id),
  cycle_label   text,
  source        text,
  is_baseline   boolean NOT NULL DEFAULT true,
  base_grid_id  uuid REFERENCES eval_grids(id),
  created_by    uuid REFERENCES auth.users(id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Grade levels associated with a grid (many-to-many)
CREATE TABLE IF NOT EXISTS eval_grid_grades (
  grid_id        uuid NOT NULL REFERENCES eval_grids(id) ON DELETE CASCADE,
  grade_level_id int  NOT NULL REFERENCES grade_levels(id) ON DELETE CASCADE,
  PRIMARY KEY (grid_id, grade_level_id)
);

-- Performance levels (columns: A, B, C, D, E ...)
CREATE TABLE IF NOT EXISTS eval_grid_levels (
  id         serial PRIMARY KEY,
  grid_id    uuid    NOT NULL REFERENCES eval_grids(id) ON DELETE CASCADE,
  code       text    NOT NULL,
  label      text    NOT NULL,
  sort_order smallint DEFAULT 0
);

-- Criteria (rows)
CREATE TABLE IF NOT EXISTS eval_grid_criteria (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grid_id    uuid    NOT NULL REFERENCES eval_grids(id) ON DELETE CASCADE,
  label      text    NOT NULL,
  weight     smallint,
  sort_order smallint DEFAULT 0
);

-- Descriptors (criterion x level cell)
CREATE TABLE IF NOT EXISTS eval_grid_cells (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  criterion_id uuid NOT NULL REFERENCES eval_grid_criteria(id) ON DELETE CASCADE,
  level_id     int  NOT NULL REFERENCES eval_grid_levels(id)  ON DELETE CASCADE,
  descriptor   text,
  UNIQUE (criterion_id, level_id)
);

-- ── RLS ─────────────────────────────────────────────────────

ALTER TABLE eval_grids         ENABLE ROW LEVEL SECURITY;
ALTER TABLE eval_grid_grades   ENABLE ROW LEVEL SECURITY;
ALTER TABLE eval_grid_levels   ENABLE ROW LEVEL SECURITY;
ALTER TABLE eval_grid_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE eval_grid_cells    ENABLE ROW LEVEL SECURITY;

-- eval_grids: baseline = public read; user copies = own all
DO $$ BEGIN
  CREATE POLICY "eval_grids: read" ON eval_grids FOR SELECT
    USING (is_baseline = true OR created_by = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "eval_grids: own insert" ON eval_grids FOR INSERT
    WITH CHECK (is_baseline = false AND created_by = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "eval_grids: own update" ON eval_grids FOR UPDATE
    USING (is_baseline = false AND created_by = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "eval_grids: own delete" ON eval_grids FOR DELETE
    USING (is_baseline = false AND created_by = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Sub-tables: visible if parent grid is visible; writable if owned
DO $$ BEGIN
  CREATE POLICY "eval_grid_grades: read" ON eval_grid_grades FOR SELECT
    USING (EXISTS (SELECT 1 FROM eval_grids eg WHERE eg.id = eval_grid_grades.grid_id AND (eg.is_baseline = true OR eg.created_by = auth.uid())));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "eval_grid_grades: own write" ON eval_grid_grades FOR ALL
    USING (EXISTS (SELECT 1 FROM eval_grids eg WHERE eg.id = eval_grid_grades.grid_id AND eg.created_by = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "eval_grid_levels: read" ON eval_grid_levels FOR SELECT
    USING (EXISTS (SELECT 1 FROM eval_grids eg WHERE eg.id = eval_grid_levels.grid_id AND (eg.is_baseline = true OR eg.created_by = auth.uid())));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "eval_grid_levels: own write" ON eval_grid_levels FOR ALL
    USING (EXISTS (SELECT 1 FROM eval_grids eg WHERE eg.id = eval_grid_levels.grid_id AND eg.created_by = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "eval_grid_criteria: read" ON eval_grid_criteria FOR SELECT
    USING (EXISTS (SELECT 1 FROM eval_grids eg WHERE eg.id = eval_grid_criteria.grid_id AND (eg.is_baseline = true OR eg.created_by = auth.uid())));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "eval_grid_criteria: own write" ON eval_grid_criteria FOR ALL
    USING (EXISTS (SELECT 1 FROM eval_grids eg WHERE eg.id = eval_grid_criteria.grid_id AND eg.created_by = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "eval_grid_cells: read" ON eval_grid_cells FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM eval_grid_criteria ec
      JOIN eval_grids eg ON eg.id = ec.grid_id
      WHERE ec.id = eval_grid_cells.criterion_id
        AND (eg.is_baseline = true OR eg.created_by = auth.uid())
    ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "eval_grid_cells: own write" ON eval_grid_cells FOR ALL
    USING (EXISTS (
      SELECT 1 FROM eval_grid_criteria ec
      JOIN eval_grids eg ON eg.id = ec.grid_id
      WHERE ec.id = eval_grid_cells.criterion_id
        AND eg.created_by = auth.uid()
    ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;