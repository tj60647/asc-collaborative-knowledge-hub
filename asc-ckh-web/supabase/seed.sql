-- supabase/seed.sql
-- Clear existing test events
DELETE FROM asc_ckh.events;

DO $$
DECLARE
  pwd_hash text := crypt('password123', gen_salt('bf'));
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

  -- Set dummy admins (10, 11) for testing
  UPDATE auth.users SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"admin"') WHERE email IN ('member10@example.com', 'member11@example.com');
  
  -- 1. Insert Admin
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@asc-cybernetics.org', pwd_hash, NOW(), '{"provider":"email","providers":["email"]}', format('{"email":"admin@asc-cybernetics.org","email_verified":true,"phone_verified":false,"sub":"%s","first_name":"System","last_name":"Administrator"}', admin_id)::jsonb, NOW(), NOW());
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), admin_id, admin_id, format('{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}', admin_id, 'admin@asc-cybernetics.org')::jsonb, 'email', NOW(), NOW());

  -- 2. Insert Personas
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES 
    (senior_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'senior.researcher@asc-cybernetics.org', pwd_hash, NOW(), '{"provider":"email","providers":["email"]}', format('{"email":"senior.researcher@asc-cybernetics.org","email_verified":true,"phone_verified":false,"sub":"%s","first_name":"Aris","last_name":"Scholar"}', senior_id)::jsonb, NOW(), NOW());
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), senior_id, senior_id, format('{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}', senior_id, 'senior.researcher@asc-cybernetics.org')::jsonb, 'email', NOW(), NOW());

  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES 
    (student_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'new.student@asc-cybernetics.org', pwd_hash, NOW(), '{"provider":"email","providers":["email"]}', format('{"email":"new.student@asc-cybernetics.org","email_verified":true,"phone_verified":false,"sub":"%s","first_name":"Jordan","last_name":"Learner"}', student_id)::jsonb, NOW(), NOW());
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), student_id, student_id, format('{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}', student_id, 'new.student@asc-cybernetics.org')::jsonb, 'email', NOW(), NOW());

  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES 
    (board_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'board.member@asc-cybernetics.org', pwd_hash, NOW(), '{"provider":"email","providers":["email"]}', format('{"email":"board.member@asc-cybernetics.org","email_verified":true,"phone_verified":false,"sub":"%s","first_name":"Elena","last_name":"Director"}', board_id)::jsonb, NOW(), NOW());
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), board_id, board_id, format('{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}', board_id, 'board.member@asc-cybernetics.org')::jsonb, 'email', NOW(), NOW());

  -- 3. Insert 11 dummy members
  FOR i IN 1..11 LOOP
    new_uuid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (new_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'member' || i || '@example.com', pwd_hash, NOW(), '{"provider":"email","providers":["email"]}', format('{"email":"member%s@example.com","email_verified":true,"phone_verified":false,"sub":"%s","first_name":"Member%s","last_name":"Test"}', i, new_uuid, i)::jsonb, NOW(), NOW());
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
    VALUES (gen_random_uuid(), new_uuid, new_uuid, format('{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}', new_uuid, 'member' || i || '@example.com')::jsonb, 'email', NOW(), NOW());
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

  -- 6. Seed Knowledge Resources (Glossary Terms)
  -- Published terms
  INSERT INTO asc_ckh.knowledge_resources (id, title, content, type, author_id, status)
  VALUES 
    (gen_random_uuid(), 'Requisite Variety', 'Ashby''s Law: Only variety can destroy variety. A control system must have at least as many states as the system it is trying to control.', 'glossary_term', senior_id, 'published'),
    (gen_random_uuid(), 'Second-Order Cybernetics', 'The cybernetics of cybernetics. Investigates the role of the observer in constructing the reality they are observing, acknowledging that the observer is part of the system.', 'glossary_term', admin_id, 'published'),
    (gen_random_uuid(), 'Homeostasis', 'The tendency of a system, especially the physiological system of higher animals, to maintain internal stability, owing to the coordinated response of its parts to any situation or stimulus that would tend to disturb its normal condition or function.', 'glossary_term', senior_id, 'published'),
    (gen_random_uuid(), 'Autopoiesis', 'A system capable of reproducing and maintaining itself. Introduced by Maturana and Varela to describe the fundamental dialectic between structure and function in living systems.', 'glossary_term', board_id, 'published'),
    (gen_random_uuid(), 'Feedback Loop', 'A process in which the outputs of a system are circled back and used as inputs. In cybernetics, negative feedback stabilizes systems while positive feedback amplifies deviations.', 'glossary_term', admin_id, 'published');

  -- 7. Seed Expert Questions
  INSERT INTO asc_ckh.expert_questions (id, question, author_id, status, answer, answered_by)
  VALUES 
    (gen_random_uuid(), 'Can you clarify the difference between first and second-order cybernetics?', student_id, 'answered', 'First-order cybernetics studies the observed system as an independent entity. Second-order cybernetics includes the observer within the system being studied, recognizing that our observations are constructed.', senior_id),
    (gen_random_uuid(), 'Is autopoiesis applicable to social systems?', student_id, 'pending', NULL, NULL),
    (gen_random_uuid(), 'Hey you guys are all wrong about this cyber stuff, just look at crypto.', student_id, 'pending', NULL, NULL);

END $$;
