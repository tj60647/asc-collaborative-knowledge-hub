-- Create Events table
CREATE TABLE asc_ckh.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- 'speaker_series', 'board_meeting', 'study_group', 'conference'
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  meeting_url TEXT,
  created_by UUID REFERENCES asc_ckh.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE asc_ckh.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are viewable by all members" ON asc_ckh.events FOR SELECT USING (true);
CREATE POLICY "Admins can insert events" ON asc_ckh.events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM asc_ckh.user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update events" ON asc_ckh.events FOR UPDATE USING (
  EXISTS (SELECT 1 FROM asc_ckh.user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete events" ON asc_ckh.events FOR DELETE USING (
  EXISTS (SELECT 1 FROM asc_ckh.user_profiles WHERE id = auth.uid() AND role = 'admin')
);
