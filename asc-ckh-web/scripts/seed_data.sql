
-- 1. Promote Admin
UPDATE asc_ckh.user_profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@asc-cybernetics.org');

-- 2. Update Titles (The trigger doesn't capture title_prefix yet)
UPDATE asc_ckh.user_profiles SET title_prefix = 'Dr.' WHERE id = (SELECT id FROM auth.users WHERE email = 'senior.researcher@asc-cybernetics.org');
UPDATE asc_ckh.user_profiles SET title_prefix = 'Prof.' WHERE id = (SELECT id FROM auth.users WHERE email = 'board.member@asc-cybernetics.org');

-- 3. Insert Events
INSERT INTO asc_ckh.events (title, description, event_type, start_time, end_time, location, created_by)
VALUES 
  ('ASC Speaker Series: Cybernetics of Cybernetics', 'A deep dive into second-order cybernetics.', 'speaker_series', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours', 'Zoom', (SELECT id FROM auth.users WHERE email = 'admin@asc-cybernetics.org')),
  ('Monthly Board Meeting', 'Executive board planning.', 'board_meeting', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '1 hour', 'Google Meet', (SELECT id FROM auth.users WHERE email = 'admin@asc-cybernetics.org')),
  ('Study Group: Ashby''s Introduction', 'Reading Chapter 1.', 'study_group', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '1.5 hours', 'Discord', (SELECT id FROM auth.users WHERE email = 'admin@asc-cybernetics.org')),
  ('ASC 2026 Annual Conference', 'Global gathering.', 'conference', NOW() + INTERVAL '60 days', NOW() + INTERVAL '63 days', 'Vienna, Austria', (SELECT id FROM auth.users WHERE email = 'admin@asc-cybernetics.org'));
  