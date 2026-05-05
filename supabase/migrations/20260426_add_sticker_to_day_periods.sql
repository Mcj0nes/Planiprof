-- Autocollants flottants sur la vue hebdomadaire
CREATE TABLE IF NOT EXISTS week_stickers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    annual_plan_id uuid NOT NULL REFERENCES annual_plans(id) ON DELETE CASCADE,
      week_start date NOT NULL,
        sticker_name text NOT NULL,
          x integer NOT NULL DEFAULT 0,
            y integer NOT NULL DEFAULT 0,
              width integer NOT NULL DEFAULT 80,
                created_at timestamptz DEFAULT now()
                );
                ALTER TABLE week_stickers ENABLE ROW LEVEL SECURITY;
                CREATE POLICY "week_stickers_select" ON week_stickers FOR SELECT
                  USING (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));
                  CREATE POLICY "week_stickers_insert" ON week_stickers FOR INSERT
                    WITH CHECK (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));
                    CREATE POLICY "week_stickers_update" ON week_stickers FOR UPDATE
                      USING (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));
                      CREATE POLICY "week_stickers_delete" ON week_stickers FOR DELETE
                        USING (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));

                        -- Heures de périodes par planification annuelle
                        CREATE TABLE IF NOT EXISTS plan_period_times (
                          annual_plan_id uuid NOT NULL REFERENCES annual_plans(id) ON DELETE CASCADE,
                            period_number smallint NOT NULL,
                              time_label text NOT NULL DEFAULT '',
                                PRIMARY KEY (annual_plan_id, period_number)
                                );
                                ALTER TABLE plan_period_times ENABLE ROW LEVEL SECURITY;
                                CREATE POLICY "plan_period_times_select" ON plan_period_times FOR SELECT
                                  USING (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));
                                  CREATE POLICY "plan_period_times_insert" ON plan_period_times FOR INSERT
                                    WITH CHECK (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));
                                    CREATE POLICY "plan_period_times_update" ON plan_period_times FOR UPDATE
                                      USING (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));
                                      CREATE POLICY "plan_period_times_delete" ON plan_period_times FOR DELETE
                                        USING (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));
                                        