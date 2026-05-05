-- Drop unique indexes that prevent multiple plans for the same subject/grade/year.
-- Teachers may have multiple groups or change schools and need duplicate combinations.
DROP INDEX IF EXISTS annual_plans_single_subject_unique;
DROP INDEX IF EXISTS annual_plans_multi_subject_unique;
