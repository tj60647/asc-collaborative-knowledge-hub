-- supabase/seed.sql
-- Clear existing test events
DELETE FROM asc_ckh.events;

DO $$
DECLARE
  pwd_hash text := '$2a$10$tZ921m3.p/wAOKg12eH5Qe2H4mB4O4oI5/5w55P/845O/z71.9kR2';
  admin_id uuid := 'c4b1b3b1-1234-4567-8901-abcdef123450';
  senior_id uuid := 'c4b1b3b1-1234-4567-8901-abcdef123451';
  student_id uuid := 'c4b1b3b1-1234-4567-8901-abcdef123452';
  board_id uuid := 'c4b1b3b1-1234-4567-8901-abcdef123453';
  new_uuid uuid;
BEGIN

  -- Delete existing test users to avoid conflicts
  DELETE FROM auth.users WHERE email IN (
    'admin@asc-cybernetics.org',
    'senior.researcher@asc-cybernetics.org',
    'new.student@asc-cybernetics.org',
    'board.member@asc-cybernetics.org'
  ) OR email LIKE 'member%@example.com';

  -- 1. Insert Admin
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@asc-cybernetics.org', pwd_hash, NOW(), '{"provider":"email","providers":["email"]}', '{"first_name":"System","last_name":"Administrator"}', NOW(), NOW());
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), admin_id, admin_id, format('{"sub":"%s","email":"%s"}', admin_id, 'admin@asc-cybernetics.org')::jsonb, 'email', NOW(), NOW());

  -- 2. Insert Personas
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES 
    (senior_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'senior.researcher@asc-cybernetics.org', pwd_hash, NOW(), '{"provider":"email","providers":["email"]}', '{"first_name":"Aris","last_name":"Scholar"}', NOW(), NOW());
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), senior_id, senior_id, format('{"sub":"%s","email":"%s"}', senior_id, 'senior.researcher@asc-cybernetics.org')::jsonb, 'email', NOW(), NOW());

  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES 
    (student_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'new.student@asc-cybernetics.org', pwd_hash, NOW(), '{"provider":"email","providers":["email"]}', '{"first_name":"Jordan","last_name":"Learner"}', NOW(), NOW());
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), student_id, student_id, format('{"sub":"%s","email":"%s"}', student_id, 'new.student@asc-cybernetics.org')::jsonb, 'email', NOW(), NOW());

  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES 
    (board_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'board.member@asc-cybernetics.org', pwd_hash, NOW(), '{"provider":"email","providers":["email"]}', '{"first_name":"Elena","last_name":"Director"}', NOW(), NOW());
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), board_id, board_id, format('{"sub":"%s","email":"%s"}', board_id, 'board.member@asc-cybernetics.org')::jsonb, 'email', NOW(), NOW());

  -- 3. Insert 11 dummy members
  FOR i IN 1..11 LOOP
    new_uuid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (new_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'member' || i || '@example.com', pwd_hash, NOW(), '{"provider":"email","providers":["email"]}', ('{"first_name":"Member' || i || '","last_name":"Test"}')::jsonb, NOW(), NOW());
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
    VALUES (gen_random_uuid(), new_uuid, new_uuid, format('{"sub":"%s","email":"%s"}', new_uuid, 'member' || i || '@example.com')::jsonb, 'email', NOW(), NOW());
  END LOOP;

  -- 4. Set Profile Titles and Admin Role
  UPDATE asc_ckh.user_profiles SET role = 'admin' WHERE id = admin_id;
  UPDATE asc_ckh.user_profiles SET title_prefix = 'Dr.' WHERE id = senior_id;
  UPDATE asc_ckh.user_profiles SET title_prefix = 'Prof.' WHERE id = board_id;

  -- 5. Insert 20 Synthetic Events
  INSERT INTO asc_ckh.events (title, description, event_type, start_time, end_time, location, created_by)
  VALUES 
    ('ASC Speaker Series: Cybernetics of Cybernetics', 'A deep dive into second-order cybernetics.', 'speaker_series', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours', 'Zoom', admin_id),
    ('Monthly Board Meeting', 'Executive board planning.', 'board_meeting', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '1 hour', 'Google Meet', admin_id),
    ('Study Group: Ashby''s Introduction', 'Reading Chapter 1.', 'study_group', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '1.5 hours', 'Discord', admin_id),
    ('ASC 2026 Annual Conference', 'Global gathering.', 'conference', NOW() + INTERVAL '60 days', NOW() + INTERVAL '63 days', 'Vienna, Austria', admin_id),
    ('Cybernetics Reading Group', 'Discussing Bateson.', 'study_group', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '1.5 hours', 'Discord', senior_id),
    ('Design Cybernetics Workshop', 'Interactive session on design.', 'speaker_series', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '3 hours', 'Zoom', board_id),
    ('New Member Orientation', 'Welcome to ASC.', 'study_group', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '1 hour', 'Zoom', board_id),
    ('Ethics in Systems Research', 'Panel discussion.', 'speaker_series', NOW() + INTERVAL '21 days', NOW() + INTERVAL '21 days' + INTERVAL '2 hours', 'Zoom', senior_id),
    ('Fundraising Committee', 'Planning Q3.', 'board_meeting', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '1 hour', 'Google Meet', board_id),
    ('Cybernetics and AI', 'Exploring overlaps.', 'speaker_series', NOW() + INTERVAL '28 days', NOW() + INTERVAL '28 days' + INTERVAL '2 hours', 'Zoom', admin_id),
    ('Student Mixer', 'Meet other cybernetics students.', 'study_group', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days' + INTERVAL '1 hour', 'Discord', student_id),
    ('History of ASC Archive Review', 'Looking at old documents.', 'study_group', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '2 hours', 'Zoom', senior_id),
    ('Complexity Theory Primer', 'Guest lecture.', 'speaker_series', NOW() + INTERVAL '35 days', NOW() + INTERVAL '35 days' + INTERVAL '1.5 hours', 'Zoom', senior_id),
    ('Quarterly Review', 'Financial and strategic review.', 'board_meeting', NOW() + INTERVAL '45 days', NOW() + INTERVAL '45 days' + INTERVAL '2 hours', 'Google Meet', board_id),
    ('Systems Science Symposium', 'Mini conference.', 'conference', NOW() + INTERVAL '120 days', NOW() + INTERVAL '121 days', 'Online', admin_id),
    ('Varela Reading Group', 'Embodied cognition.', 'study_group', NOW() + INTERVAL '18 days', NOW() + INTERVAL '18 days' + INTERVAL '1.5 hours', 'Discord', senior_id),
    ('Cybernetics in the Arts', 'Showcase and discussion.', 'speaker_series', NOW() + INTERVAL '40 days', NOW() + INTERVAL '40 days' + INTERVAL '2 hours', 'Zoom', student_id),
    ('Website Redesign Feedback', 'Reviewing the new hub.', 'study_group', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '1 hour', 'Discord', admin_id),
    ('Elenas Keynote Practice', 'Dry run for conference.', 'speaker_series', NOW() + INTERVAL '50 days', NOW() + INTERVAL '50 days' + INTERVAL '1 hour', 'Zoom', board_id),
    ('Open Office Hours', 'Chat with the board.', 'board_meeting', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '1 hour', 'Google Meet', board_id);

END $$;
