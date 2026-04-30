-- ============================================================
-- PLANIPROF — Grilles d'évaluation liées à la planification
-- ============================================================

-- Lien entre une grille et un plan annuel (+ étape optionnelle)
CREATE TABLE plan_eval_links (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  annual_plan_id uuid NOT NULL REFERENCES annual_plans(id) ON DELETE CASCADE,
  eval_grid_id   uuid NOT NULL REFERENCES eval_grids(id)   ON DELETE CASCADE,
  etape_id       uuid REFERENCES gb_etapes(id) ON DELETE SET NULL,
  created_at     timestamptz DEFAULT now(),
  UNIQUE(annual_plan_id, eval_grid_id)
);

-- Évaluation d'un élève sur une grille liée (1 par élève par lien)
CREATE TABLE plan_eval_assessments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id    uuid NOT NULL REFERENCES plan_eval_links(id)   ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES gb_students(id)       ON DELETE CASCADE,
  comment    text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(link_id, student_id)
);

-- Marque par critère : quel niveau l'élève a atteint sur ce critère
CREATE TABLE plan_eval_marks (
  assessment_id uuid NOT NULL REFERENCES plan_eval_assessments(id) ON DELETE CASCADE,
  criterion_id  uuid NOT NULL REFERENCES eval_grid_criteria(id)    ON DELETE CASCADE,
  level_id      int  NOT NULL REFERENCES eval_grid_levels(id)      ON DELETE CASCADE,
  PRIMARY KEY (assessment_id, criterion_id)
);

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE plan_eval_links       ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_eval_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_eval_marks       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner" ON plan_eval_links FOR ALL USING (
  EXISTS (
    SELECT 1 FROM annual_plans ap
    WHERE ap.id = annual_plan_id AND ap.user_id = auth.uid()
  )
);

CREATE POLICY "owner" ON plan_eval_assessments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM plan_eval_links l
    JOIN annual_plans ap ON ap.id = l.annual_plan_id
    WHERE l.id = link_id AND ap.user_id = auth.uid()
  )
);

CREATE POLICY "owner" ON plan_eval_marks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM plan_eval_assessments a
    JOIN plan_eval_links l ON l.id = a.link_id
    JOIN annual_plans ap ON ap.id = l.annual_plan_id
    WHERE a.id = assessment_id AND ap.user_id = auth.uid()
  )
);
