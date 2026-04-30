-- Bidirectional collaboration: grid STRUCTURES are readable between collaborators.
-- Data tables (scores, jugements, grades) remain strictly private.
-- Uses conditional blocks so tables that don't exist yet are safely skipped.

DO $$ BEGIN

-- =====================================================================
-- EVALUATION GRIDS
-- =====================================================================
IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='eval_grids') THEN
  EXECUTE $p$
    CREATE POLICY "eval_grids: collab select" ON eval_grids FOR SELECT USING (
      EXISTS (SELECT 1 FROM user_collaborators uc
        WHERE (uc.owner_id = eval_grids.created_by AND uc.collaborator_id = auth.uid())
           OR (uc.collaborator_id = eval_grids.created_by AND uc.owner_id = auth.uid()))
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='eval_grid_levels') THEN
  EXECUTE $p$
    CREATE POLICY "eval_grid_levels: collab select" ON eval_grid_levels FOR SELECT USING (
      EXISTS (SELECT 1 FROM eval_grids eg
        JOIN user_collaborators uc ON (
          (uc.owner_id = eg.created_by AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = eg.created_by AND uc.owner_id = auth.uid()))
        WHERE eg.id = eval_grid_levels.grid_id)
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='eval_grid_criteria') THEN
  EXECUTE $p$
    CREATE POLICY "eval_grid_criteria: collab select" ON eval_grid_criteria FOR SELECT USING (
      EXISTS (SELECT 1 FROM eval_grids eg
        JOIN user_collaborators uc ON (
          (uc.owner_id = eg.created_by AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = eg.created_by AND uc.owner_id = auth.uid()))
        WHERE eg.id = eval_grid_criteria.grid_id)
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='eval_grid_cells') THEN
  EXECUTE $p$
    CREATE POLICY "eval_grid_cells: collab select" ON eval_grid_cells FOR SELECT USING (
      EXISTS (SELECT 1 FROM eval_grid_criteria ec
        JOIN eval_grids eg ON eg.id = ec.grid_id
        JOIN user_collaborators uc ON (
          (uc.owner_id = eg.created_by AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = eg.created_by AND uc.owner_id = auth.uid()))
        WHERE ec.id = eval_grid_cells.criterion_id)
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='eval_grid_grades') THEN
  EXECUTE $p$
    CREATE POLICY "eval_grid_grades: collab select" ON eval_grid_grades FOR SELECT USING (
      EXISTS (SELECT 1 FROM eval_grids eg
        JOIN user_collaborators uc ON (
          (uc.owner_id = eg.created_by AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = eg.created_by AND uc.owner_id = auth.uid()))
        WHERE eg.id = eval_grid_grades.grid_id)
    )
  $p$;
END IF;

-- =====================================================================
-- CAUSERIES
-- =====================================================================
IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='causeries_grids') THEN
  EXECUTE $p$
    CREATE POLICY "causeries_grids: collab select" ON causeries_grids FOR SELECT USING (
      EXISTS (SELECT 1 FROM user_collaborators uc
        WHERE (uc.owner_id = causeries_grids.user_id AND uc.collaborator_id = auth.uid())
           OR (uc.collaborator_id = causeries_grids.user_id AND uc.owner_id = auth.uid()))
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='causeries_students') THEN
  EXECUTE $p$
    CREATE POLICY "causeries_students: collab select" ON causeries_students FOR SELECT USING (
      EXISTS (SELECT 1 FROM causeries_grids g
        JOIN user_collaborators uc ON (
          (uc.owner_id = g.user_id AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = g.user_id AND uc.owner_id = auth.uid()))
        WHERE g.id = causeries_students.grid_id)
    )
  $p$;
END IF;

-- =====================================================================
-- CONVERSATION GRIDS
-- =====================================================================
IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='conversation_sessions') THEN
  EXECUTE $p$
    CREATE POLICY "conversation_sessions: collab select" ON conversation_sessions FOR SELECT USING (
      EXISTS (SELECT 1 FROM user_collaborators uc
        WHERE (uc.owner_id = conversation_sessions.user_id AND uc.collaborator_id = auth.uid())
           OR (uc.collaborator_id = conversation_sessions.user_id AND uc.owner_id = auth.uid()))
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='conversation_session_students') THEN
  EXECUTE $p$
    CREATE POLICY "conversation_session_students: collab select" ON conversation_session_students FOR SELECT USING (
      EXISTS (SELECT 1 FROM conversation_sessions cs
        JOIN user_collaborators uc ON (
          (uc.owner_id = cs.user_id AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = cs.user_id AND uc.owner_id = auth.uid()))
        WHERE cs.id = conversation_session_students.session_id)
    )
  $p$;
END IF;

-- =====================================================================
-- SCIENCES — 3E CYCLE
-- =====================================================================
IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='sci_obs_grids') THEN
  EXECUTE $p$
    CREATE POLICY "sci_obs_grids: collab select" ON sci_obs_grids FOR SELECT USING (
      EXISTS (SELECT 1 FROM user_collaborators uc
        WHERE (uc.owner_id = sci_obs_grids.user_id AND uc.collaborator_id = auth.uid())
           OR (uc.collaborator_id = sci_obs_grids.user_id AND uc.owner_id = auth.uid()))
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='sci_obs_students') THEN
  EXECUTE $p$
    CREATE POLICY "sci_obs_students: collab select" ON sci_obs_students FOR SELECT USING (
      EXISTS (SELECT 1 FROM sci_obs_grids g
        JOIN user_collaborators uc ON (
          (uc.owner_id = g.user_id AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = g.user_id AND uc.owner_id = auth.uid()))
        WHERE g.id = sci_obs_students.grid_id)
    )
  $p$;
END IF;

-- =====================================================================
-- SCIENCES — 2E CYCLE
-- =====================================================================
IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='sci2_obs_grids') THEN
  EXECUTE $p$
    CREATE POLICY "sci2_obs_grids: collab select" ON sci2_obs_grids FOR SELECT USING (
      EXISTS (SELECT 1 FROM user_collaborators uc
        WHERE (uc.owner_id = sci2_obs_grids.user_id AND uc.collaborator_id = auth.uid())
           OR (uc.collaborator_id = sci2_obs_grids.user_id AND uc.owner_id = auth.uid()))
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='sci2_obs_students') THEN
  EXECUTE $p$
    CREATE POLICY "sci2_obs_students: collab select" ON sci2_obs_students FOR SELECT USING (
      EXISTS (SELECT 1 FROM sci2_obs_grids g
        JOIN user_collaborators uc ON (
          (uc.owner_id = g.user_id AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = g.user_id AND uc.owner_id = auth.uid()))
        WHERE g.id = sci2_obs_students.grid_id)
    )
  $p$;
END IF;

-- =====================================================================
-- ARTS PLASTIQUES — 2E CYCLE
-- =====================================================================
IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='arts2_obs_grids') THEN
  EXECUTE $p$
    CREATE POLICY "arts2_obs_grids: collab select" ON arts2_obs_grids FOR SELECT USING (
      EXISTS (SELECT 1 FROM user_collaborators uc
        WHERE (uc.owner_id = arts2_obs_grids.user_id AND uc.collaborator_id = auth.uid())
           OR (uc.collaborator_id = arts2_obs_grids.user_id AND uc.owner_id = auth.uid()))
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='arts2_obs_students') THEN
  EXECUTE $p$
    CREATE POLICY "arts2_obs_students: collab select" ON arts2_obs_students FOR SELECT USING (
      EXISTS (SELECT 1 FROM arts2_obs_grids g
        JOIN user_collaborators uc ON (
          (uc.owner_id = g.user_id AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = g.user_id AND uc.owner_id = auth.uid()))
        WHERE g.id = arts2_obs_students.grid_id)
    )
  $p$;
END IF;

-- =====================================================================
-- ARTS PLASTIQUES — 3E CYCLE
-- =====================================================================
IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='arts3_obs_grids') THEN
  EXECUTE $p$
    CREATE POLICY "arts3_obs_grids: collab select" ON arts3_obs_grids FOR SELECT USING (
      EXISTS (SELECT 1 FROM user_collaborators uc
        WHERE (uc.owner_id = arts3_obs_grids.user_id AND uc.collaborator_id = auth.uid())
           OR (uc.collaborator_id = arts3_obs_grids.user_id AND uc.owner_id = auth.uid()))
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='arts3_obs_students') THEN
  EXECUTE $p$
    CREATE POLICY "arts3_obs_students: collab select" ON arts3_obs_students FOR SELECT USING (
      EXISTS (SELECT 1 FROM arts3_obs_grids g
        JOIN user_collaborators uc ON (
          (uc.owner_id = g.user_id AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = g.user_id AND uc.owner_id = auth.uid()))
        WHERE g.id = arts3_obs_students.grid_id)
    )
  $p$;
END IF;

-- =====================================================================
-- UNIVERS SOCIAL — 2E CYCLE
-- =====================================================================
IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='us2_obs_grids') THEN
  EXECUTE $p$
    CREATE POLICY "us2_obs_grids: collab select" ON us2_obs_grids FOR SELECT USING (
      EXISTS (SELECT 1 FROM user_collaborators uc
        WHERE (uc.owner_id = us2_obs_grids.user_id AND uc.collaborator_id = auth.uid())
           OR (uc.collaborator_id = us2_obs_grids.user_id AND uc.owner_id = auth.uid()))
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='us2_obs_students') THEN
  EXECUTE $p$
    CREATE POLICY "us2_obs_students: collab select" ON us2_obs_students FOR SELECT USING (
      EXISTS (SELECT 1 FROM us2_obs_grids g
        JOIN user_collaborators uc ON (
          (uc.owner_id = g.user_id AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = g.user_id AND uc.owner_id = auth.uid()))
        WHERE g.id = us2_obs_students.grid_id)
    )
  $p$;
END IF;

-- =====================================================================
-- UNIVERS SOCIAL — 3E CYCLE
-- =====================================================================
IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='us3_obs_grids') THEN
  EXECUTE $p$
    CREATE POLICY "us3_obs_grids: collab select" ON us3_obs_grids FOR SELECT USING (
      EXISTS (SELECT 1 FROM user_collaborators uc
        WHERE (uc.owner_id = us3_obs_grids.user_id AND uc.collaborator_id = auth.uid())
           OR (uc.collaborator_id = us3_obs_grids.user_id AND uc.owner_id = auth.uid()))
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='us3_obs_students') THEN
  EXECUTE $p$
    CREATE POLICY "us3_obs_students: collab select" ON us3_obs_students FOR SELECT USING (
      EXISTS (SELECT 1 FROM us3_obs_grids g
        JOIN user_collaborators uc ON (
          (uc.owner_id = g.user_id AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = g.user_id AND uc.owner_id = auth.uid()))
        WHERE g.id = us3_obs_students.grid_id)
    )
  $p$;
END IF;

-- =====================================================================
-- GRILLES D'OBSERVATION PERSONNALISÉES
-- =====================================================================
IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='custom_obs_definitions') THEN
  EXECUTE $p$
    CREATE POLICY "custom_obs_definitions: collab select" ON custom_obs_definitions FOR SELECT USING (
      EXISTS (SELECT 1 FROM user_collaborators uc
        WHERE (uc.owner_id = custom_obs_definitions.user_id AND uc.collaborator_id = auth.uid())
           OR (uc.collaborator_id = custom_obs_definitions.user_id AND uc.owner_id = auth.uid()))
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='custom_obs_sessions') THEN
  EXECUTE $p$
    CREATE POLICY "custom_obs_sessions: collab select" ON custom_obs_sessions FOR SELECT USING (
      EXISTS (SELECT 1 FROM user_collaborators uc
        WHERE (uc.owner_id = custom_obs_sessions.user_id AND uc.collaborator_id = auth.uid())
           OR (uc.collaborator_id = custom_obs_sessions.user_id AND uc.owner_id = auth.uid()))
    )
  $p$;
END IF;

IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='custom_obs_students') THEN
  EXECUTE $p$
    CREATE POLICY "custom_obs_students: collab select" ON custom_obs_students FOR SELECT USING (
      EXISTS (SELECT 1 FROM custom_obs_sessions s
        JOIN user_collaborators uc ON (
          (uc.owner_id = s.user_id AND uc.collaborator_id = auth.uid())
          OR (uc.collaborator_id = s.user_id AND uc.owner_id = auth.uid()))
        WHERE s.id = custom_obs_students.session_id)
    )
  $p$;
END IF;

END $$;
