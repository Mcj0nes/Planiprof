CREATE TABLE IF NOT EXISTS school_calendar_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_year text NOT NULL,
  event_date date NOT NULL,
  event_type text NOT NULL DEFAULT 'autre',
  label text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE school_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "school_calendar_events_owner" ON school_calendar_events
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX school_calendar_events_user_year ON school_calendar_events (user_id, school_year);
CREATE INDEX school_calendar_events_date ON school_calendar_events (user_id, event_date);
