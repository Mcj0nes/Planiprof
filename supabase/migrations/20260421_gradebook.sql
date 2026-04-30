-- ============================================================
-- PLANIPROF — Carnet de notes
-- ============================================================

CREATE TABLE grade_books (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  annual_plan_id uuid NOT NULL REFERENCES annual_plans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(annual_plan_id)
);

CREATE TABLE gb_students (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  grade_book_id uuid NOT NULL REFERENCES grade_books(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order smallint NOT NULL DEFAULT 0
);

CREATE TABLE gb_etapes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  grade_book_id uuid NOT NULL REFERENCES grade_books(id) ON DELETE CASCADE,
  name text NOT NULL,
  weight numeric(5,2) NOT NULL DEFAULT 0,
  sort_order smallint NOT NULL DEFAULT 0
);

CREATE TABLE gb_evaluations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  etape_id uuid NOT NULL REFERENCES gb_etapes(id) ON DELETE CASCADE,
  name text NOT NULL,
  weight numeric(5,2) NOT NULL DEFAULT 100,
  grading_type text NOT NULL DEFAULT 'numeric' CHECK (grading_type IN ('numeric', 'letter')),
  sort_order smallint NOT NULL DEFAULT 0
);

CREATE TABLE gb_grades (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES gb_students(id) ON DELETE CASCADE,
  evaluation_id uuid NOT NULL REFERENCES gb_evaluations(id) ON DELETE CASCADE,
  grade text,
  UNIQUE(student_id, evaluation_id)
);

CREATE TABLE gb_etape_overrides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES gb_students(id) ON DELETE CASCADE,
  etape_id uuid NOT NULL REFERENCES gb_etapes(id) ON DELETE CASCADE,
  grade text,
  UNIQUE(student_id, etape_id)
);

-- RLS
ALTER TABLE grade_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE gb_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE gb_etapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gb_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gb_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE gb_etape_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner" ON grade_books FOR ALL USING (user_id = auth.uid());

CREATE POLICY "owner" ON gb_students FOR ALL USING (
  EXISTS (SELECT 1 FROM grade_books gb WHERE gb.id = grade_book_id AND gb.user_id = auth.uid())
);

CREATE POLICY "owner" ON gb_etapes FOR ALL USING (
  EXISTS (SELECT 1 FROM grade_books gb WHERE gb.id = grade_book_id AND gb.user_id = auth.uid())
);

CREATE POLICY "owner" ON gb_evaluations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM gb_etapes e
    JOIN grade_books gb ON gb.id = e.grade_book_id
    WHERE e.id = etape_id AND gb.user_id = auth.uid()
  )
);

CREATE POLICY "owner" ON gb_grades FOR ALL USING (
  EXISTS (
    SELECT 1 FROM gb_students s
    JOIN grade_books gb ON gb.id = s.grade_book_id
    WHERE s.id = student_id AND gb.user_id = auth.uid()
  )
);

CREATE POLICY "owner" ON gb_etape_overrides FOR ALL USING (
  EXISTS (
    SELECT 1 FROM gb_students s
    JOIN grade_books gb ON gb.id = s.grade_book_id
    WHERE s.id = student_id AND gb.user_id = auth.uid()
  )
);
