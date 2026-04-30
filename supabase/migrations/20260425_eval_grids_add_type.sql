-- Add grid_type to distinguish evaluation grids from conversation/observation grids
-- Default 'evaluation' so all existing grids are unaffected

ALTER TABLE eval_grids
  ADD COLUMN IF NOT EXISTS grid_type text NOT NULL DEFAULT 'evaluation';
