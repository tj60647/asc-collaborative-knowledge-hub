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
-- Scraped Real Events from Teamup
INSERT INTO asc_ckh.events (id, title, description, event_type, start_time, end_time, location, created_by) VALUES
('77ccd0c3-e2a5-413f-a55a-a88dab540184', 'Metaphorum 2025: Humans at risk?', '<p>While the global geo-political and economic environment is becoming increasingly stressed by wars, the catastrophic impacts of climate change, and social upheaval, social organisations need to learn how to consolidate their resilience. Maintaining their financial viability, improving their sustainability, and contributing to social and environmental well-being requires increasing efforts.</p>
<p>Resilience, the capacity to adapt, innovate and thrive amidst uncertainty while maintaining core values, is essential for long-term viability and sustainability. Exploring new paths for developing organisational resilience is a must, but there are not yet many proven approaches to achieve it.</p>
<p>However, as artificial intelligence is becoming central to decision-making, organisations face an existential challenge: how to avoid the extremes of stagnation and chaos. More than ever, there is a growing paradox between providing autonomy to social agents to develop their own potentials and creating a coherent and cohesive context to allow organisations to thrive and develop.</p>
<p>Cybernetics is the mother science of both systemic approaches to management, like the Viable System Model, and of technological sciences like artificial intelligence. This conference explores how cybernetic principles, particularly Stafford Beerâ€™s Viable System Model (VSM) and Team Syntegrity (TS), offer a comprehensive framework which can serve as the bridge between these two extremes: on one hand we observe unsustainable and vulnerable organisations, struggling to develop resilience and co-evolve sustainably with their niches.</p>
<p>On the other hand, corporations and profit oriented organisations are now incorporating the latest technologies like artificial intelligence to increase their decision-making capabilities, but risk losing control or diminishing human agency.</p>
<p>Learning from innovations in VSM and TS theory and praxis, participants will gain insights into steering through complexity effectively, creating systems that empower humans while leveraging the potential of intelligent agents. We aim to provide a balanced mix of theory, practice and interaction, ensuring participants leave with actionable insights and a deeper understanding of cybernetic approaches to organizational design. The methodology for the conference will focus on creating a rich space for networking and white space conversations.</p>
<p><strong>Our conference approach</strong></p>
<p>Following our very successful conference in Berlin, we want to keep the spirit of creating an interactive experience where presentations and opportunities to exchange ideas and interact are nicely balanced. Our methodological pillars:</p>
<ul>
<li>This will be a face-to-face conference with limited on-line participation through Zoom.</li>
<li>During the conference, we will make sure we include time for thorough dialogue with the participants in each session, and in the breaks.</li>
<li>We will invite you to present your ideas in creative ways and to engage the other participants â€“ through poster presentations, pre-recorded videos (like a provocation to a rich debate) â€“ and when convenient, short but engaging slideshow presentations.</li>
<li>At the online marketplace before the conference, the participants will vote on the best presentations. The top 3 will be on stage as a plenary (1 hour each) in the main room, one each day. All the others will be in break-out rooms (the duration of each talk will be 40 mins approximately â€“ t.b.c.).</li>
<li>You may also be creative in the way of presenting, e.g. by doing a game, a play, â€¦ the choice is yours!</li>
</ul>', 'speaker_series', '2025-07-04T00:00:00', '2025-07-06T23:59:00', 'Manchester Business School, Manchester, UK', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('b8f6b2ef-ab76-464e-9731-3908b29b7907', 'VSM-AI Special Integration Group', '', 'speaker_series', '2025-04-16T12:00:00-04:00', '2025-04-16T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('ae4a4bbd-d730-413a-a485-dd1f9ddea21d', 'VSM-AI Special Integration Group', '', 'speaker_series', '2025-05-21T12:00:00-04:00', '2025-05-21T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('0f74a962-035a-4a75-9343-884d8b9dbd2c', '', '', 'speaker_series', '2025-06-11T12:00:00-04:00', '2025-06-11T13:00:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('3b6e5903-5de0-42c2-b4e9-c58febd408a0', '', '<p><strong>Wed 18th June 1700-1900 Badlands series - Privacy - Jo Davaris &amp; Geoff Smith</strong>Building on the themes examined in our ''Badlands'' event on 30th April,Â Jo Ann Lengua Davaris will be exploring the theme of privacy.Â  Â Jo Ann Lengua Davaris serves as the Global Chief Privacy Officer at Booking Holdings, a role she has held since 2019, where she has pioneered a unified privacy framework across the companyâ€™s iconic brands, including Booking.com, Priceline, Kayak, OpenTable, and Agoda. Her leadership ensures that privacy and data protection are seamlessly woven into global operations while driving innovation, maintaining consumer trust, and enabling the safe expansion of business opportunities. Jo is deeply passionate about shaping policies at the intersection of privacy and AI governance, ensuring that ethical frameworks guide emerging technologies and align with organizational goals.Â Â She received both her JD and her BA from Fordham University.Jo will be in conversation with Geoff Smith.Â Â For more than 30 years Geoff has led commercially focused data privacy and empowerment functions; developing, operating and transforming data systems and culture across diverse sectors from financial services and tourism to energy suppliers and public health. He is currently involved in building an innovative Green Tech aimed at enabling micro firms to become more carbon efficient and establishing a boutique data consultancy helping organisations manage their â€˜quantum riskâ€™.Â  As a Visiting Professor at Loughborough University he lectures and researches on topics such as digital ethics and trust economies, innovation, leadership and empowerment technology.Â Before the meeting please use the link below to register:<br><a href="https://us06web.zoom.us/meeting/register/GfgP1y3ITIqbcsIPK9QpLg" target="_blank" rel="noreferrer noopener external">https://us06web.zoom.us/meeting/register/GfgP1y3ITIqbcsIPK9QpLg</a>Â Â Once you have registered then Zoom will send you a link to join the meeting.Â  Please don''t use the link above to join the meeting otherwise it will ask you to register again.Â <br>Further upcoming events are below:</p>', 'speaker_series', '2025-06-18T12:00:00-04:00', '2025-06-18T14:00:00-04:00', 'Online - Zook', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('e4da9e24-297e-4b3d-b0eb-bb279787f159', 'VSM-AI Special Integration Group', '', 'speaker_series', '2025-06-18T12:00:00-04:00', '2025-06-18T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('59968b60-4a88-42fd-8af5-00ae0125e627', '', '<p><strong>Sent:</strong>Â Friday 6 June 2025 at 17:40:27 BST<strong>Subject:</strong>Â Cybernetics Society AGM - Saturday 21st June 2025 1000-1230 Agenda, Biographies, and 2024 minutes<br>Dear members,<br>In preparation for the AGM on 21st June 2025 10.00-12.30 please find attached:- the agenda- biographies of theÂ Trustees, Officers and Council members who are continuing or standing for electionÂ - the draft minutes issued shortly after the 2024 AGM, for approval on 21st June<br>The biographies include Peter Tuddenham who is standing for Vice-President,Â  Ian Kendrick who is standing for Secretary,Â  Richard Berry who is standing for Council,Â  and Catherine Lawes who is standing again for Council and is taking on special responsibility for membership.Â <br>As a reminder, per the Society''s Rules the Trustees, Treasurer, and Secretary hold office during the pleasure of the Society.Â  Where the relevant individuals are happy to continue there is no need to actively re-appoint at the AGM.Â  The President, Vice-President and other Council members are elected each year.Â <br><br>If there are any further nominations for Council then please can you let me have these no later than Friday 13th of June, so that I can then circulate in line with theÂ 7 days notice of AGM businessÂ per our Rules.<br>The AGM will be conducted on Zoom.Â  The registration link is below:Zoom Meeting -Â Saturday 21st June 2025Â  10.00-12.30</p>
<p><a href="https://us06web.zoom.us/meeting/register/klPQNeX0TT-9YKlmeATFqA" target="_blank" rel="noreferrer noopener external">https://us06web.zoom.us/meeting/register/klPQNeX0TT-9YKlmeATFqA</a><br>Before the meeting please use the link above to register.Â Â Once you have registered then Zoom will send you a link to join the meeting.Â  Please don''t use the link above to join the meeting otherwise it will ask you to register again.Â Â <br>Thank youJonathan RandallCybernetics Society Secretary</p>', 'speaker_series', '2025-06-21T05:00:00-04:00', '2025-06-21T07:30:00-04:00', 'https://us06web.zoom.us/meeting/register/klPQNeX0TT-9YKlmeATFqA', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('fc006043-d92f-4076-9d2c-04dae11fca0f', 'CybSoc 2025 Conversation', '<p>Annual conversation and conference</p>', 'speaker_series', '2025-06-30T00:00:00', '2025-07-02T23:59:00', 'Loughborough University, England', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('7615d516-1c81-4bd4-a4ff-b26d1e97b369', '', '<p>John Beckford has taken on the task of attempting to mastermind the event again this year.</p>
<p>Â </p>
<p>As always the aim of The Cybernetics Conversation is to build each session around a question, proposition or challenge. The session â€˜leaderâ€™, having stimulated the session with their ideas, guides elicitation of the insights, knowledge and experience of the others in the room.Â As usual we hope to see the development of cybernetic and systems ideas across multiple sectors - public, private, charity and social enterprises, politics and the sciences and humanities.</p>
<p>Â </p>
<p>Prof. Andrew Pickering has agreed to attend and provide an insight to his work and interpretation of cybernetics. In addition we have some broad themes emerging from other conversations including (somewhat loosely):</p>
<p>Â </p>
<p>â€œCybernetics andâ€¦â€¦1: Technology and Dystopia2: Diagnosis, Prognosis and Therapy (inspired by medicine and healthcare but not constrained to it)3: Governance, Stakeholder Interest andÂ Evolving Organisation (what IS an organisation?)</p>
<p>4: Uncertainty and Decision-Making</p>
<p>5: The State of Democracy and the Democracy of the State"</p>
<p>Â </p>
<p>And, of course there are many sub-themes within eachâ€¦â€¦â€¦..</p>
<p></p>
<p>We need you to make your offers and suggestions so that we can create a structure through which the emerging ideas can be explored and, if appropriate, synthesised â€“ and we will use the facilities in the rooms to capture as appropriate.</p>
<p>Â </p>
<p>Offers to lead sessions are will be greatly appreciated Â - particularly if accompanied by a suggested theme or thread.</p>
<p>Â </p>
<p>Please let John and I know if you would like to make a contribution.</p>
<p>Â </p>
<p>Tickets are now on sale via the link below:<a href="https://www.eventbrite.co.uk/e/the-cybernetics-conversation-2025-tickets-1255370881099?aff=oddtdtcreator" rel="noreferrer noopener external" target="_blank">https://www.eventbrite.co.uk/e/the-cybernetics-conversation-2025-tickets-1255370881099?aff=oddtdtcreator</a><br><br>The event will run from 11.00 on Monday 30th June to 14.00 Wednesday 2nd July at Loughborough University Business School.Â  The ticket prices include lunches and refreshments but don''t include accommodation.Â  In previous years most people have booked their accommodation at the Premier Inn on Southfield road but there are many other hotels available in Loughborough, includingÂ the Travelodge on Bridge StreetÂ and three hotels on the university campus.Â Links are below:<a href="https://www.premierinn.com/gb/en/home.html" rel="noreferrer noopener external" target="_blank">https://www.premierinn.com/gb/en/home.html</a><br><a href="https://www.travelodge.co.uk/" rel="noreferrer noopener external" target="_blank">https://www.travelodge.co.uk/</a><br><a href="https://www.lboro.ac.uk/services/accommodation/short-stay-accommodation/hotels/" rel="noreferrer noopener external" target="_blank">University hotels | Accommodation | Loughborough University</a><br>Best Regards</p>
<p>Â </p>
<p>Jonathan and John</p>
<p>john.beckford@beckfordconsulting.comjonathanrandall1@yahoo.co.uk</p>', 'speaker_series', '2025-06-30T00:00:00', '2025-07-02T23:59:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('8e353fc8-190a-4374-a27a-86be7aead420', 'Communities of Possibilities', '<p>TheÂ <strong>5th International Conference of Possibility Studies</strong> will be held in person at the National University of Ireland, Maynooth, with the themeÂ <strong>Communities of Possibility</strong>.</p>
<p>This edition is organised by theÂ <strong>Department of Psychology</strong>Â atÂ <strong>Maynooth University</strong>Â and theÂ <strong>DCU Centre for Possibility Studies</strong>Â under the auspices of theÂ <strong>Possibility Studies Network</strong>.</p>
<p>The conference will bring together scholars, researchers, and practitioners from around the world and from across disciplines with an interest in the diverse methods associated with understanding, studying, and fostering the possible within minds, communities, and cultures.</p>
<p><a href="https://www.possibilitystudies.net/event/5th-international-conference-of-possibility-studies/" rel="noreferrer noopener external" target="_blank"><strong>Registration opens March 25</strong></a>.</p>
<p></p>
<p><img src="https://www.possibilitystudies.net/wp-content/uploads/2024/12/PSN-Logo-classic-dark.png" alt=""></p>', 'speaker_series', '2025-06-30T00:00:00', '2025-07-04T23:59:00', 'National University of Ireland, Maynooth', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('50c7f58c-dc1d-4b9b-a009-2fb9ee56da85', 'Metaphorum 2025', '<p>Annual conference. More information at <a href="https://teamup.com/ks5451rd8zrzzyk2mx" rel="noreferrer noopener external" target="_blank">https://metaphorum2025.sched.com</a></p>', 'speaker_series', '2025-07-02T00:00:00', '2025-07-02T23:59:00', 'Manchester Business School, Manchester, England', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('bf21e519-15df-46fd-8fae-df39cb6f8582', 'Metaphorum 2025', '<p>Annual conference. More information at <a href="https://teamup.com/ks5451rd8zrzzyk2mx" rel="noreferrer noopener external" target="_blank">https://metaphorum2025.sched.com</a></p>', 'speaker_series', '2025-07-03T00:00:00', '2025-07-03T23:59:00', 'Manchester Business School, Manchester, England', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('5384f146-4e21-4b83-af06-1bdd93564907', 'Metaphorum 2025: Humans at risk?', '<p>While the global geo-political and economic environment is becoming increasingly stressed by wars, the catastrophic impacts of climate change, and social upheaval, social organisations need to learn how to consolidate their resilience. Maintaining their financial viability, improving their sustainability, and contributing to social and environmental well-being requires increasing efforts.</p>
<p>Resilience, the capacity to adapt, innovate and thrive amidst uncertainty while maintaining core values, is essential for long-term viability and sustainability. Exploring new paths for developing organisational resilience is a must, but there are not yet many proven approaches to achieve it.</p>
<p>However, as artificial intelligence is becoming central to decision-making, organisations face an existential challenge: how to avoid the extremes of stagnation and chaos. More than ever, there is a growing paradox between providing autonomy to social agents to develop their own potentials and creating a coherent and cohesive context to allow organisations to thrive and develop.</p>
<p>Cybernetics is the mother science of both systemic approaches to management, like the Viable System Model, and of technological sciences like artificial intelligence. This conference explores how cybernetic principles, particularly Stafford Beerâ€™s Viable System Model (VSM) and Team Syntegrity (TS), offer a comprehensive framework which can serve as the bridge between these two extremes: on one hand we observe unsustainable and vulnerable organisations, struggling to develop resilience and co-evolve sustainably with their niches.</p>
<p>On the other hand, corporations and profit oriented organisations are now incorporating the latest technologies like artificial intelligence to increase their decision-making capabilities, but risk losing control or diminishing human agency.</p>
<p>Learning from innovations in VSM and TS theory and praxis, participants will gain insights into steering through complexity effectively, creating systems that empower humans while leveraging the potential of intelligent agents. We aim to provide a balanced mix of theory, practice and interaction, ensuring participants leave with actionable insights and a deeper understanding of cybernetic approaches to organizational design. The methodology for the conference will focus on creating a rich space for networking and white space conversations.</p>
<p><strong>Our conference approach</strong></p>
<p>Following our very successful conference in Berlin, we want to keep the spirit of creating an interactive experience where presentations and opportunities to exchange ideas and interact are nicely balanced. Our methodological pillars:</p>
<ul>
<li>This will be a face-to-face conference with limited on-line participation through Zoom.</li>
<li>During the conference, we will make sure we include time for thorough dialogue with the participants in each session, and in the breaks.</li>
<li>We will invite you to present your ideas in creative ways and to engage the other participants â€“ through poster presentations, pre-recorded videos (like a provocation to a rich debate) â€“ and when convenient, short but engaging slideshow presentations.</li>
<li>At the online marketplace before the conference, the participants will vote on the best presentations. The top 3 will be on stage as a plenary (1 hour each) in the main room, one each day. All the others will be in break-out rooms (the duration of each talk will be 40 mins approximately â€“ t.b.c.).</li>
<li>You may also be creative in the way of presenting, e.g. by doing a game, a play, â€¦ the choice is yours!</li>
</ul>', 'speaker_series', '2025-07-04T00:00:00', '2025-07-06T23:59:00', 'Manchester Business School, Manchester, UK', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('3e61eac9-c964-44e0-9191-ea5ef37fcf7a', 'Metaphorum 2025', '<p>Annual conference. More information at <a href="https://teamup.com/ks5451rd8zrzzyk2mx" rel="noreferrer noopener external" target="_blank">https://metaphorum2025.sched.com</a></p>', 'speaker_series', '2025-07-04T00:00:00', '2025-07-04T23:59:00', 'Manchester Business School, Manchester, England', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('2b1679a0-51be-409e-b164-12103285b632', 'Metaphorum 2025', '<p>Annual conference. More information at <a href="https://teamup.com/ks5451rd8zrzzyk2mx" rel="noreferrer noopener external" target="_blank">https://metaphorum2025.sched.com</a></p>', 'speaker_series', '2025-07-05T00:00:00', '2025-07-05T23:59:00', 'Manchester Business School, Manchester, England', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('9cad7446-6fbf-4a71-931f-1892e12354c3', '', '<p><a href="https://www.isss.org/2025-birmingham-uk/" target="_blank" rel="noreferrer noopener external">https://www.isss.org/2025-birmingham-uk/</a></p>
<p></p>
<p>Call for Papers and Contributions: ISSS 2025 International Conference</p>
<p>Theme: Advancing Together - An Invitation for Systemic Collaboration<br>Date: 11th-15th July 2025<br>Location: Birmingham Leadership Institute, UK</p>
<p>The International Society for System Sciences (ISSS) is pleased to announce its 2025 conference, to be held at the prestigious Birmingham Leadership Institute in the UK. This flagship event will bring together global scholars, practitioners, and thought leaders to explore the theme of Advancing Together: An invitation for Systemic Collaboration</p>
<p>In an era of unprecedented complexity and interconnected challenges, the systems community is uniquely positioned to lead efforts in creating holistic, collaborative solutions. This conference aims to facilitate dialogue and action, fostering the emergence of a cohesive systems science enterprise that integrates diverse perspectives and practices across disciplines.</p>
<p>Featured Workshop Day on Global Collaboration - â€œAdvancing Togetherâ€</p>
<p>The ISSS would like to extend an invitation to organizations committed to systems approaches to join us at this workshop on the opening day where we will explore shared interests, pool our knowledge and resources, and leverage our collective capabilities to better tackle mutual challenges and create meaningful impact guided by the following questions:</p>
<ul>
<li>
<p>What could successful collaboration look like?</p>
</li>
<li>
<p>What are the barriers to collaboration?</p>
</li>
<li>
<p>What practical steps can we take to foster collaboration?</p>
</li>
</ul>
<h3>Call for Papers and Contributions</h3>
<p>We invite submissions that align with the conference theme and contribute to the advancement of systems science. Submissions may include, but are not limited to:</p>
<ul>
<li>
<p>Theoretical advancements in system science and transdisciplinary integration.</p>
</li>
<li>
<p>Practical applications of systems thinking in addressing global challenges, including the Anthropocene, regeneration, sustainability, and governance.</p>
</li>
<li>
<p>Case studies demonstrating collaborative systems approaches across sectors.</p>
</li>
<li>
<p>Innovative methodologies and tools for system management, design, analysis, and evaluation.</p>
</li>
<li>
<p>Educational initiatives fostering systems thinking and professional development.</p>
</li>
<li>
<p>Collaborative frameworks bridging gaps between research, policy, and practice.</p>
</li>
</ul>
<p><strong><br><br></strong></p>
<p>We would particularly appreciate proposals representative of opportunity for collaboration that require transdisciplinary, trans organisation, trans regional efforts:</p>
<ul>
<li>
<p>Agriculture and food systemsÂ </p>
</li>
<li>
<p>Augmented intelligenceÂ </p>
</li>
<li>
<p>Built environment</p>
</li>
<li>
<p>Climate change</p>
</li>
<li>
<p>Ecology of Humanness</p>
</li>
<li>
<p>Economy</p>
</li>
<li>
<p>Education and knowledge sharing</p>
</li>
<li>
<p>Environment</p>
</li>
<li>
<p>Energy</p>
</li>
<li>
<p>Healthcare</p>
</li>
<li>
<p>Policy and Governance</p>
</li>
<li>
<p>Shared Theoretical Foundations</p>
</li>
<li>
<p>Space exploration and development</p>
</li>
<li>
<p>Social-ecological systems</p>
</li>
<li>
<p>Theoretical Foundations</p>
</li>
</ul>
<h3>Submission Guidelines</h3>
<p><a href="https://www.isss.org/submitting-abstracts/" target="_blank" rel="noreferrer noopener external">Please visit the ISSS website here for more detailed submission requirements.</a></p>
<p>Authors are invited to submit:</p>
<ul>
<li>
<p>Full papers (4,000â€“7,000 words) for presentation and publication in conference proceedings.</p>
</li>
<li>
<p>Short papers (1,500â€“3,000 words) or posters showcasing ongoing work or preliminary findings.</p>
</li>
<li>
<p>Interactive workshops or panel proposals encouraging participatory engagement.</p>
</li>
</ul>
<p>All submissions will undergo a peer-review process. Accepted contributions will be eligible for publication in the ISSS conference proceedings and considered for the ISSS Yearbook in the journal Systems Research and Behavioural Science.Â </p>
<h3>Key Dates</h3>
<ul>
<li>
<p>Opening for proposals: January 15th, 2025</p>
</li>
<li>
<p>Abstract (All proposal types) Submission Deadline: May 15th, 2025</p>
</li>
</ul>
<h3>Join the Conversation</h3>
<p>This conference provides a platform to build meaningful collaborations and advance collective understanding. Together, we will:</p>
<ul>
<li>
<p>Identify barriers and opportunities for collaboration across the systems field.</p>
</li>
<li>
<p>Share insights and practices for systemic transformation.</p>
</li>
<li>
<p>Co-create pathways toward a unified systems science enterprise.</p>
</li>
</ul>
<p>We look forward to your participation in this vital endeavor. For more information, visit our website or contact us. Letâ€™s shape the future of systems science together!</p>
<p>Submit your contributions today and join us in Birmingham for ISSS 2025.</p>', 'speaker_series', '2025-07-11T00:00:00', '2025-07-15T23:59:00', 'University of Birmingham England', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('80c4c0d6-968c-450f-892e-fa94a0c29ffe', 'VSM-AI Special Integration Group', '', 'speaker_series', '2025-07-16T12:00:00-04:00', '2025-07-16T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('a99317ab-ad1b-4e52-9d61-7e0d999c0afa', '', '<p>REGISTER NOW <a href="https://us02web.zoom.us/meeting/register/5GTpdtpUSdKkLwkiBdBrrw" target="_blank" rel="noreferrer noopener external">https://us02web.zoom.us/meeting/register/5GTpdtpUSdKkLwkiBdBrrw</a></p>
<p></p>
<p>Rose-Margaret Ekeng-Itua is a pioneering STEM Educator, Administrator, and Engineer and an advocate for educational equality for underserved groups; including, women, minorities, and other marginalized groups. She is a strategic leader in higher education pedagogy, policy, and STEM strategy. Rose-Margaret has 15+ years of expertise in teaching, improving student achievement, retention, and progression in STEM Higher Education.Â </p>', 'speaker_series', '2025-08-12T00:00:00', '2025-08-12T23:59:00', 'Online - Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('4403d6ab-8882-42d8-987c-0b9973f80072', 'VSM-AI Special Integration Group', '', 'speaker_series', '2025-08-20T12:00:00-04:00', '2025-08-20T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('92f813c7-82f4-4e79-a676-8362b5fd1cea', '', '<p><strong>Ecocybernetics as a provocation to rethink -Â </strong>Angus Jenkinson</p>
<p>Cybernetics is a good name. So why the â€˜rebrandâ€™? The provocation is a set of insights into the origins and nature of cybernetics. It proposes that ecocybernetics focuses on its ontological rather than historic origins, its full scope of explanatory power, and its potential to resolve important issues facing humanity today. Feedback informing this provocation includes (positively) the nature of ecology and (negatively) the historical and biographical conditions of its first formulation by Wiener, McCulloch and co. The science is still immature, but cybernetic activity is the matrix of ecology as a living dynamic milieu. Directive activity and homeostasis existed from the beginnings of life. By contrast, design of assistive military hardware along with the invention of the computer were the prime context in the formation and specification of the discipline, but this was never all it was. To embrace the full power of cybernetics means thinking like the composite metapsychome of a recursive ecosystem. The largest such ecosystem we have is Earth in its cosmic context. The nationâ€™s budget should be ecocybernetic in global synch.Angus Jenkinson, FCybS, is a former Secretary of the Cybernetics Society, research professor, and advisor focusing on coherent organisations.</p>', 'speaker_series', '2025-09-09T12:00:00-04:00', '2025-09-09T14:00:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('2fdf0c78-f238-471f-8dc1-492961f113e9', 'VSM-AI Special Integration Group', '', 'speaker_series', '2025-09-17T12:00:00-04:00', '2025-09-17T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('b048e0f8-ffae-4cca-827e-4710a1febb64', 'Relating Systems Thinking and Design Symposium, RSD14', '<p>Each year, the RSD symposium serves as a capstone for the systemic design community, addressing complex design issues, social systems, policy, socioecological sustainability, and critical cultural perspectives. The Systemic Design Association publishes annual proceedings, available as a searchable repository on <a href="https://rsdsymposium.org/" rel="noreferrer noopener external">RSDsymposium.org</a>.</p>
<p>RSD14-ONLINE | Paper Talks | OCT 8â€“10 | ONLINE</p>
<p>RSD14-TORONTO | October 15â€“18 | IN PERSON</p>', 'speaker_series', '2025-10-03T00:00:00', '2025-10-21T23:59:00', 'OCAD University, Toronto, Canada', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('78ac25e1-e240-4629-a9c3-77371b0fb062', 'Decoding Reality â€“ Quantum Information', '<p><strong>Cybernetics Live</strong><strong>8th October 2025 Â 1700-1900 UKÂ  Decoding Reality â€“ Quantum Information â€“ Prof Vlatko Vedral </strong><a href="https://www.vlatkovedral.com/" target="_blank" rel="noreferrer noopener external">https://www.vlatkovedral.com/</a></p>
<p>We are delighted to welcome a world leading researcher with a deep-rooted passion for a fundamental topic.Â  Quantum information (QI) is emerging and will influence our understanding of systems and life.</p>
<p>This Cybernetics Live event aims to explore QI and challenge us to consider the impacts.</p>
<p>Established Cybernetics appreciates the importance of variety.Â  We live in a world where the disruptive effects of digital data are beginning to be understood. Â Â Yet sitting beneath that, we have an even more complex, sophisticated and challenging world to comprehend when our focus on the binary moves to the quantum.</p>
<p>In this Decoding Reality event, our explorations might consider meaning in a QI world or venture into topics like Quantum AI.Â  We might ask:</p>
<ol>
<li>How is the Cybernetic concept of variety related to the idea of (multiple) data compressions that decode reality? What does this imply for a philosophy of science?</li>
<li>How do we refine our understanding of concepts of entropy and time once we consider information-theoretic frameworks?</li>
<li>â€œIt from bitâ€ (Wheeler) or â€œBit from itâ€ (Vedral) â€“ ultimately, what implications?</li>
<li>Information is a measure of surprise and is also contextual, so an information technology is thereby a means of amplifying some surprise, attenuating other possibilities, and a means of specifying some contexts, obscuring others?</li>
<li>Are we able to understand the implications of QI? How might we educate people and organisations to utilise the full value of quantum-based systems?</li>
</ol>
<p><strong>We need CybSoc members views prior to the event please. Â Â Consider the following questions and we will try to assemble your views into this Cybernetics Live event.Â  Â <a href="https://s.zoom.us/m/bPFioc0E5" target="_blank" rel="noreferrer noopener external">Please fill this survey to answer these questions</a></strong></p>
<ol>
<li>What would you like to know about QI Theory?</li>
<li>What would you like to tell Vlatko about Cybernetics that you think is relevant to QI?</li>
<li>What question would you ask around the social impact of the quantum?</li>
<li>What are the three most important cybernetic principles for QI theory?</li>
<li>What are possible priority areas of research that Quantum Cybernetics might consider?</li>
</ol>
<p><strong><a href="https://us02web.zoom.us/meeting/register/yznGIWMhQsC5SUjuWzW7bQ" target="_blank" rel="noreferrer noopener external">REGISTER NOW</a></strong></p>', 'speaker_series', '2025-10-08T17:00:00-04:00', '2025-10-08T18:00:00-04:00', 'Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('0d0692f7-7777-40a4-a4f5-abc775e382bb', 'Ecologies of Knowing', '<p>The #NewMacy and ASC collaboration explores relationality in complexity across domains of information mapping, architecture, design, and organisational structures in diverse disciplines, geographies, and generations. #NewMacy and ASC converse with this year''s conference theme, Arcs of Impact, to explore how effects unfold in ever-expanding time and scale through a dynamic interplay of components with wholeness emerging from relationships. The day includes a range of cybernetic enactments from evolving community engagements in Brazil, creating experimental glossaries and archives, developing laboratory approaches to student-focused curricula, and studying the environmental interdependence of honeybees. The #NewMacy/ASC takeover begins with a speculative address on language-in-action hinged on uncertainty, moves through questions of design ethics and pedagogies, and ends with organisation and modelling of viable systems. In a world where our actions create a ripple effect, we ask: how can systemic design become a living ecology that catalyses conversation?</p>
<p><a href="https://rsdsymposium.org/ecologies-of-knowing/" title="RSD14-Ecologies of Knowing" rel="noreferrer noopener external" target="_blank">https://rsdsymposium.org/ecologies-of-knowing/</a></p>', 'speaker_series', '2025-10-12T00:00:00', '2025-10-12T23:59:00', 'online', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('13b58139-ec66-4d3c-8d7d-d47e660f6013', 'VSM-AI Special Integration Group', '', 'speaker_series', '2025-10-15T12:00:00-04:00', '2025-10-15T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('f8eb924d-9e5a-4ab2-801d-26f22c7d33ee', '', '<p><a href="https://www.tickettailor.com/checkout/view-event/id/6939516/chk/e4d1/?entry_link=%2Fall-tickets%2Fmetaphorum1%2F%3Fbg_fill%3Dfalse%26minimal%3Dtrue%26ref%3Dwebsite_widget%26show_date_filter%3Dtrue%26show_logo%3Dfalse%26show_search_filter%3Dtrue%26show_sort%3Dtrue%26widget%3Dtrue&amp;ref=website_widget&amp;show_search_filter=true&amp;show_date_filter=true&amp;show_sort=true&amp;widget=true&amp;minimal=true&amp;show_logo=false&amp;bg_fill=false#top" target="_blank" rel="noreferrer noopener external">Webinar: â€˜Variety recounting and dis/agreement in a radical cola companyâ€™ by James FoxParticipate.Â  1700 UK </a></p>', 'speaker_series', '2025-11-04T12:00:00-05:00', '2025-11-04T13:00:00-05:00', 'Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('5d96fb3b-8958-432e-a570-cdb215efd1c8', 'Badlands 3', '<p><strong>18th November 2025 Badlands 3 Katie Muldoon and Giles HerdaleÂ <br></strong>Violence against Women and Girls<br>Freedom<br>Coach on Eudaimonia</p>', 'speaker_series', '2025-11-18T17:00:00-05:00', '2025-11-18T18:00:00-05:00', 'Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('584cffa2-ad2b-4e5a-ba70-21775faa0a80', 'VSM-AI Special Integration Group', '', 'speaker_series', '2025-11-19T12:00:00-05:00', '2025-11-19T13:30:00-05:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('153c76bc-b6ed-4b4b-9462-c994f7bd733e', 'Webinar: ''â€˜Dealing with Climate Change: Systemic Strategies by Scope and Scaleâ€™ by Markus Schwaninger', '<p><a href="https://www.tickettailor.com/checkout/view-event/id/6939519/chk/d3c8/?entry_link=%2Fall-tickets%2Fmetaphorum1%2F%3Fbg_fill%3Dfalse%26minimal%3Dtrue%26ref%3Dwebsite_widget%26show_date_filter%3Dtrue%26show_logo%3Dfalse%26show_search_filter%3Dtrue%26show_sort%3Dtrue%26widget%3Dtrue&amp;ref=website_widget&amp;show_search_filter=true&amp;show_date_filter=true&amp;show_sort=true&amp;widget=true&amp;minimal=true&amp;show_logo=false&amp;bg_fill=false#top" rel="noreferrer noopener external" target="_blank">Webinar: ''â€˜Dealing with Climate Change: Systemic Strategies by Scope and Scaleâ€™ by Markus SchwaningerParticipateÂ Â Â Â </a><br>1700 UK</p>', 'speaker_series', '2025-12-03T12:00:00-05:00', '2025-12-03T13:00:00-05:00', 'zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('743d0521-ea94-435e-b049-dbac52da6ebb', 'Emergent Language and Systemic Understanding: AI Augmented Deliberations Through a Cybernetic Lens', '<p><strong>10 December 2025 Â 1700-1900 Emergent Language and Systemic Understanding: AI Augmented Deliberations Through a Cybernetic Lens â€“ Kevin Dye</strong></p>', 'speaker_series', '2025-12-10T17:00:00-05:00', '2025-12-10T18:00:00-05:00', 'Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('6e158887-0c10-4c8d-aefd-518ff9cef810', 'VSM-AI Special Integration Group', '', 'speaker_series', '2025-12-17T12:00:00-05:00', '2025-12-17T13:30:00-05:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('668c423d-1633-4b70-9a8e-947e9e3b35fc', 'Webinar: â€˜Ashby and meâ€™ by Steve Morlidge', '<p><a href="https://www.tickettailor.com/checkout/view-event/id/6939523/chk/a6d3/?entry_link=%2Fall-tickets%2Fmetaphorum1%2F%3Fbg_fill%3Dfalse%26minimal%3Dtrue%26ref%3Dwebsite_widget%26show_date_filter%3Dtrue%26show_logo%3Dfalse%26show_search_filter%3Dtrue%26show_sort%3Dtrue%26widget%3Dtrue&amp;ref=website_widget&amp;show_search_filter=true&amp;show_date_filter=true&amp;show_sort=true&amp;widget=true&amp;minimal=true&amp;show_logo=false&amp;bg_fill=false#top" target="_blank" rel="noreferrer noopener external">WedÂ 7Â JanWebinar: â€˜Ashby and meâ€™ by Steve MorlidgeParticipate</a></p>', 'speaker_series', '2026-01-07T12:00:00-05:00', '2026-01-07T13:00:00-05:00', 'Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('f74d3c69-d1df-4909-bb8c-6c9db0e74f7b', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-01-21T12:00:00-05:00', '2026-01-21T13:30:00-05:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('d856195f-ca70-4d9a-b71a-608018ddfb19', 'â€˜Viability and Action: Bridging Knowledge and Action with the Viable System Modelâ€™ by Gandolfo Dominici', '<p><a href="https://www.tickettailor.com/checkout/view-event/id/6939525/chk/fbf5/?entry_link=%2Fall-tickets%2Fmetaphorum1%2F%3Fbg_fill%3Dfalse%26minimal%3Dtrue%26ref%3Dwebsite_widget%26show_date_filter%3Dtrue%26show_logo%3Dfalse%26show_search_filter%3Dtrue%26show_sort%3Dtrue%26widget%3Dtrue&amp;ref=website_widget&amp;show_search_filter=true&amp;show_date_filter=true&amp;show_sort=true&amp;widget=true&amp;minimal=true&amp;show_logo=false&amp;bg_fill=false#top" rel="noreferrer noopener external" target="_blank">WedÂ 4Â FebWebinar: â€˜Viability and Action: Bridging Knowledge and Action with the Viable System Modelâ€™ by Gandolfo DominiciParticipate</a><br>1700 UK</p>', 'speaker_series', '2026-02-04T12:00:00-05:00', '2026-02-04T13:00:00-05:00', 'zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('dec66d22-b55d-4d83-89c3-38e0f6819a91', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-02-18T12:00:00-05:00', '2026-02-18T13:30:00-05:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('5af5639a-9cb1-42c1-a153-9cb8e8a53af8', '', '<p><strong>Cybernetics Live: 1700 UK Wednesday 18 February 2026 -Dr Robert Fosbury, D.Phil, FRAS: Editing the Sun â€” How Indoor Light Lost Touch with Evolution</strong></p>
<p><a href="https://us06web.zoom.us/meeting/register/1qyyMkW9QFyUkhBrWQFq9Q" rel="noreferrer noopener external" target="_blank">REGISTER NOW ON ZOOMÂ Â </a></p>
<p><strong>Synopsis:</strong>Â Within a single human lifetime we abandoned the broad-spectrum light that shaped all life on Earth and replaced it with the spectrally impoverished output of fluorescent tubes and white LEDs. We declared the change â€˜efficientâ€™ and moved on. Yet the biosphere evolved under a very different light regime â€” one our bodies still expect. What happens when we remove half the spectrum without realising it? Surprisingly few have asked, and the answers are only now emerging.</p>
<p><strong>Bio:</strong>Â Robert (Bob) Fosbury is currently an emeritus astronomer at the European Southern Observatory and an honorary professor at the Institute of Ophthalmology at UCL. He is an astronomer who worked for 26 years at the European Space Agency (ESA) as part of ESAâ€™s collaboration with NASA on the Hubble Space Telescope (HST) project at ST-ECF. Based at the European Southern Observatory (ESO) near Munich in Germany, Fosbury joined this initiative in 1985, more than 5 years before launch. During the latter part of this period, Bob served on NASAâ€™s Ad Hoc Science Working Group and ESAâ€™s Study Science Team as they developed the instrument concepts for the James Webb Space Telescope, the next-generation space observatory.</p>
<p>Since his retirement from ESA in 2010, he has developed interests beyond astrophysics. These led to studies of the interaction of light with biology when, during a fellowship at the Institute of Advanced Study in the University of Durham, he made contact with visual neuroscientists at the Institute of Ophthalmology at UCL which led to a the honorary position where he works in an interdisciplinary, international team to understand the effects of broad-spectrum sunlight on metabolism.</p>
<hr>', 'speaker_series', '2026-02-18T17:00:00-05:00', '2026-02-18T19:00:00-05:00', 'Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('481f0b0a-5bec-4b81-a009-a8421ac8a1f7', 'Cybernetics-Systemics for the 21st Century: Explaining - Educating - Engaging'' by William J. Reckmeyer', '<p><a href="https://www.tickettailor.com/checkout/view-event/id/6939531/chk/8bd8/?entry_link=%2Fall-tickets%2Fmetaphorum1%2F%3Fbg_fill%3Dfalse%26minimal%3Dtrue%26ref%3Dwebsite_widget%26show_date_filter%3Dtrue%26show_logo%3Dfalse%26show_search_filter%3Dtrue%26show_sort%3Dtrue%26widget%3Dtrue&amp;ref=website_widget&amp;show_search_filter=true&amp;show_date_filter=true&amp;show_sort=true&amp;widget=true&amp;minimal=true&amp;show_logo=false&amp;bg_fill=false#top" target="_blank" rel="noreferrer noopener external">WedÂ 4Â MarWebinar: ''Cybernetics-Systemics for the 21st Century: Explaining - Educating - Engaging'' by William J. ReckmeyerParticipate</a></p>', 'speaker_series', '2026-03-04T12:00:00-05:00', '2026-03-04T13:00:00-05:00', 'Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('087e18cf-cc9e-4143-bf14-1f50c5341ec9', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-03-18T12:00:00-04:00', '2026-03-18T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('519d586e-bef9-4429-989b-febed5790a25', '''Organisational cyberneticsâ€™ contribution to avoid missing the new hype of systems curiosity Dr.Roberto Palacios', '<p><a href="https://www.tickettailor.com/checkout/view-event/id/6939540/chk/2baf/?entry_link=%2Fall-tickets%2Fmetaphorum1%2F%3Fbg_fill%3Dfalse%26minimal%3Dtrue%26ref%3Dwebsite_widget%26show_date_filter%3Dtrue%26show_logo%3Dfalse%26show_search_filter%3Dtrue%26show_sort%3Dtrue%26widget%3Dtrue&amp;ref=website_widget&amp;show_search_filter=true&amp;show_date_filter=true&amp;show_sort=true&amp;widget=true&amp;minimal=true&amp;show_logo=false&amp;bg_fill=false#top" rel="noreferrer noopener external" target="_blank">WedÂ 1Â AprWebinar:''Organisational cyberneticsâ€™ contribution to avoid missing the new hype of systems curiosity Dr.Roberto PalaciosParticipate</a>. <br>1700 UK</p>', 'speaker_series', '2026-04-01T12:00:00-04:00', '2026-04-01T13:00:00-04:00', 'Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('084ddf4a-32e0-4b60-8594-deb62ebed7d6', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-04-15T12:00:00-04:00', '2026-04-15T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('10209ee0-4f47-466c-9893-216ac354558f', '''Organisational cyberneticsâ€™ contribution to avoid missing the new hype of systems curiosity Dr.Roberto Palacios', '<p><a href="https://www.tickettailor.com/checkout/view-event/id/6939543/chk/57f3/?entry_link=%2Fall-tickets%2Fmetaphorum1%2F%3Fbg_fill%3Dfalse%26minimal%3Dtrue%26ref%3Dwebsite_widget%26show_date_filter%3Dtrue%26show_logo%3Dfalse%26show_search_filter%3Dtrue%26show_sort%3Dtrue%26widget%3Dtrue&amp;ref=website_widget&amp;show_search_filter=true&amp;show_date_filter=true&amp;show_sort=true&amp;widget=true&amp;minimal=true&amp;show_logo=false&amp;bg_fill=false#top" target="_blank" rel="noreferrer noopener external">WedÂ 6Â MayWebinar: ''URUguay CIBernÃ©tico: Successfully implementing Stafford Beer''s ideasâ€™ by Victor GanonParticipate</a>.Â  1700 UK</p>', 'speaker_series', '2026-05-06T12:00:00-04:00', '2026-05-06T13:00:00-04:00', 'Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('13094de5-5b0c-42da-9fc7-680aaf7f89e3', '', '<p>Https://cybsoc.org/events.html</p>', 'speaker_series', '2026-05-20T12:00:00-04:00', '2026-05-20T13:30:00-04:00', 'Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('156f71fe-af85-4ef5-9119-0136777e6d0e', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-05-20T12:00:00-04:00', '2026-05-20T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('5a519d84-5358-42fa-9285-c796eb030954', '', '<p><a href="https://www.tickettailor.com/checkout/view-event/id/6939543/chk/57f3/?entry_link=%2Fall-tickets%2Fmetaphorum1%2F%3Fbg_fill%3Dfalse%26minimal%3Dtrue%26ref%3Dwebsite_widget%26show_date_filter%3Dtrue%26show_logo%3Dfalse%26show_search_filter%3Dtrue%26show_sort%3Dtrue%26widget%3Dtrue&amp;ref=website_widget&amp;show_search_filter=true&amp;show_date_filter=true&amp;show_sort=true&amp;widget=true&amp;minimal=true&amp;show_logo=false&amp;bg_fill=false#top" target="_blank" rel="noreferrer noopener external">WedÂ 6Â MayWebinar: ''URUguay CIBernÃ©tico: Successfully implementing Stafford Beer''s ideasâ€™ by Victor GanonParticipate</a></p>', 'speaker_series', '2026-06-10T12:00:00-04:00', '2026-06-10T13:00:00-04:00', 'Zoom', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('8f2bbad3-432d-41d0-98b3-90913cca3e91', 'The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)', '<p>TheÂ <strong>The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)</strong>Â is scheduled back-to-back with theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>Â and theÂ <a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" title="Reimagining our World Systemically - From Problematique to Purposeful Action (2026)" rel="noreferrer noopener external" target="_blank">Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</a>Â symposium.</p>
<p><br>The 2026 Summer School marks the first summer school formally organized and implemented by theÂ <a href="https://futureworlds.eu/wiki/International_Society_for_the_Systems_Sciences" title="International Society for the Systems Sciences" rel="noreferrer noopener external" target="_blank">International Society for the Systems Sciences</a>. Scheduled as a preceding activity of theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>Â and also theÂ <a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" title="Reimagining our World Systemically - From Problematique to Purposeful Action (2026)" rel="noreferrer noopener external" target="_blank">Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</a>Â international symposium, benefits from the presence of a wide mixture of actors, including:</p>
<ul>
<li>University students interested to expand and/or formalize their knowledge and skills about systems, systemic thinking, cybernetics, and complexity</li>
<li>Academics interested to share their knowledge and skills with a wider international audience</li>
<li>Practitioners interested to deepen their theoretical knowledge and acquaint themselves with diverse methodologies</li>
<li>Governance and civil society actors interested to apply concepts from systems, systemic thinking, cybernetics, and complexity</li>
<li>Universities interested to endorse the summer school courses</li>
</ul>
<p></p>
<p>https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)<a href="https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)" rel="noreferrer noopener external" target="_blank">https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)</a></p>', 'speaker_series', '2026-06-17T00:00:00', '2026-06-17T23:59:00', 'UCLAN Campus Pyla Cyprus https://maps.app.goo.gl/gj8bFFjNnhD7Fcyu6', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('157eb5a0-0105-44bc-a66c-18d7b07424e1', '2026 International Conference on the Science of Dialogic Design: Symposia for Scientists and Practitioners', '<p>TheÂ <strong>2026 International Conference on the Science of Dialogic Design: Symposia for Scientists and Practitioners</strong>Â will take place in Pyla, Cyprus, in parallel toÂ <a href="https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)" title="The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)" rel="noreferrer noopener external" target="_blank">The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)</a>, and back-to-back with theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>, and theÂ <a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" title="Reimagining our World Systemically - From Problematique to Purposeful Action (2026)" rel="noreferrer noopener external" target="_blank">Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</a> Symposium.</p>', 'conference', '2026-06-17T00:00:00', '2026-06-19T23:59:00', 'Pyla Cyprus', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('3c2d9ccc-be7a-4224-8305-7873f622c6c9', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-06-17T12:00:00-04:00', '2026-06-17T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('771feda5-c93f-4714-97ff-cfde4bcb2127', 'The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)', '<p>TheÂ <strong>The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)</strong>Â is scheduled back-to-back with theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>Â and theÂ <a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" title="Reimagining our World Systemically - From Problematique to Purposeful Action (2026)" rel="noreferrer noopener external" target="_blank">Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</a>Â symposium.</p>
<p><br>The 2026 Summer School marks the first summer school formally organized and implemented by theÂ <a href="https://futureworlds.eu/wiki/International_Society_for_the_Systems_Sciences" title="International Society for the Systems Sciences" rel="noreferrer noopener external" target="_blank">International Society for the Systems Sciences</a>. Scheduled as a preceding activity of theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>Â and also theÂ <a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" title="Reimagining our World Systemically - From Problematique to Purposeful Action (2026)" rel="noreferrer noopener external" target="_blank">Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</a>Â international symposium, benefits from the presence of a wide mixture of actors, including:</p>
<ul>
<li>University students interested to expand and/or formalize their knowledge and skills about systems, systemic thinking, cybernetics, and complexity</li>
<li>Academics interested to share their knowledge and skills with a wider international audience</li>
<li>Practitioners interested to deepen their theoretical knowledge and acquaint themselves with diverse methodologies</li>
<li>Governance and civil society actors interested to apply concepts from systems, systemic thinking, cybernetics, and complexity</li>
<li>Universities interested to endorse the summer school courses</li>
</ul>
<p></p>
<p>https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)<a href="https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)" rel="noreferrer noopener external" target="_blank">https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)</a></p>', 'speaker_series', '2026-06-18T00:00:00', '2026-06-18T23:59:00', 'UCLAN Campus Pyla Cyprus https://maps.app.goo.gl/gj8bFFjNnhD7Fcyu6', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('7d2ece84-fb57-49f9-8a81-ca39e1ddd845', '2026 International Conference on the Science of Dialogic Design: Symposia for Scientists and Practitioners', '<p>TheÂ <strong>2026 International Conference on the Science of Dialogic Design: Symposia for Scientists and Practitioners</strong>Â will take place in Pyla, Cyprus, in parallel toÂ <a href="https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)" title="The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)" rel="noreferrer noopener external" target="_blank">The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)</a>, and back-to-back with theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>, and theÂ <a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" title="Reimagining our World Systemically - From Problematique to Purposeful Action (2026)" rel="noreferrer noopener external" target="_blank">Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</a> Symposium.</p>', 'conference', '2026-06-18T00:00:00', '2026-06-20T23:59:00', 'Pyla Cyprus', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('06717508-beba-4edc-86ab-00d9871c612d', 'The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)', '<p>TheÂ <strong>The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)</strong>Â is scheduled back-to-back with theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>Â and theÂ <a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" title="Reimagining our World Systemically - From Problematique to Purposeful Action (2026)" rel="noreferrer noopener external" target="_blank">Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</a>Â symposium.</p>
<p><br>The 2026 Summer School marks the first summer school formally organized and implemented by theÂ <a href="https://futureworlds.eu/wiki/International_Society_for_the_Systems_Sciences" title="International Society for the Systems Sciences" rel="noreferrer noopener external" target="_blank">International Society for the Systems Sciences</a>. Scheduled as a preceding activity of theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>Â and also theÂ <a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" title="Reimagining our World Systemically - From Problematique to Purposeful Action (2026)" rel="noreferrer noopener external" target="_blank">Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</a>Â international symposium, benefits from the presence of a wide mixture of actors, including:</p>
<ul>
<li>University students interested to expand and/or formalize their knowledge and skills about systems, systemic thinking, cybernetics, and complexity</li>
<li>Academics interested to share their knowledge and skills with a wider international audience</li>
<li>Practitioners interested to deepen their theoretical knowledge and acquaint themselves with diverse methodologies</li>
<li>Governance and civil society actors interested to apply concepts from systems, systemic thinking, cybernetics, and complexity</li>
<li>Universities interested to endorse the summer school courses</li>
</ul>
<p></p>
<p>https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)<a href="https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)" rel="noreferrer noopener external" target="_blank">https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)</a></p>', 'speaker_series', '2026-06-19T00:00:00', '2026-06-19T23:59:00', 'UCLAN Campus Pyla Cyprus https://maps.app.goo.gl/gj8bFFjNnhD7Fcyu6', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('5c694880-75e2-4883-9501-23e0d649d0ba', '2026 International Conference on the Science of Dialogic Design: Symposia for Scientists and Practitioners', '<p>TheÂ <strong>2026 International Conference on the Science of Dialogic Design: Symposia for Scientists and Practitioners</strong>Â will take place in Pyla, Cyprus, in parallel toÂ <a href="https://futureworlds.eu/wiki/The_2026_Summer_School_of_the_International_Society_for_the_Systems_Sciences_(Pyla,_Cyprus)" title="The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)" rel="noreferrer noopener external" target="_blank">The 2026 Summer School of the International Society for the Systems Sciences (Pyla, Cyprus)</a>, and back-to-back with theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>, and theÂ <a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" title="Reimagining our World Systemically - From Problematique to Purposeful Action (2026)" rel="noreferrer noopener external" target="_blank">Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</a> Symposium.</p>', 'conference', '2026-06-19T00:00:00', '2026-06-21T23:59:00', 'Pyla Cyprus', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('bce0ed30-099e-4a7a-a81f-27ab89641ff8', '70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus', '<p>he 70th Anniversary (Platinum) Conference of theÂ <a href="https://futureworlds.eu/wiki/International_Society_for_the_Systems_Sciences" title="International Society for the Systems Sciences" rel="noreferrer noopener external" target="_blank">International Society for the Systems Sciences</a>Â (ISSS) marks a pivotal momentâ€”not just for the society, but for the world.</p>
<p></p>
<p><a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" rel="noreferrer noopener external" target="_blank">https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus</a></p>
<p>Building on the 2025 conferenceâ€™s emphasis on internal collaboration and unity within the systems sciences community, the 2026 gathering sets its sights outward. It is time for systems science to engage more visibly and meaningfully with the worldâ€™s most influential institutions: the United Nations, European Union, World Bank, OECD, IMF, African Union, national governments, major universities, and civil society at large.</p>
<p>Todayâ€™s global challenges (e.g., democratic erosion, rising inequality, climate crises, pandemics, and AI disruption) demand more than fragmented expertise or short-term solutions. They call for holistic, integrated, and adaptive thinking rooted in systems science. Yet while the need has never been greater, the discipline itself faces fragmentation and marginalization. Almost all academic systems science departments have closed, and many academics and practitioners remain scattered across fields, departments, and sectors.</p>
<p>This conference calls on systems thinkers (scientists, practitioners, educators, and decision-makers) to close this gap. We must reinvigorate our field by aligning our diverse theories and methodologies into a coherent general systems science and demonstrating its practical value on the global stage. Systems science principles and practices offer powerful tools for addressing contemporary issues, such as enhancing governance, resolving conflicts, promoting peace, and reforming education, healthcare, financial institutions, local authorities, and many other areas.</p>
<p>Importantly, the 2026 conference will spotlight both the promise and peril of artificial intelligence. AI can amplify systemic insight, support anticipatory governance, and help coordinate solutions at scale. But without ethical and systemic oversight, it also risks deepening inequities, automating harm, and eroding human agency. We must therefore explore how systems science can serve as a compass in navigating AIâ€™s uncertain terrain.</p>
<p>ISSSâ€™s Platinum Conference is a call to action to elevate systems science and cybernetics from a niche academic pursuit to a central pillar of planetary stewardship. We invite you to join us in shaping this transition, spanning disciplines, sectors, institutions, and generations.</p>
<p>Let us move from theory to action, and from siloed expertise to systemic solutions.</p>', 'board_meeting', '2026-06-22T00:00:00', '2026-06-22T23:59:00', 'Pyla Cyprus', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('14d6abb6-bc55-454d-86a7-373ca9ca7866', 'Reimagining our World Systemically - From Problematique to Purposeful Action (2026)', '<p><strong>Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</strong>Â is a Dialogue for the second quarter of the 21st Century, organized back-to-back with theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>.</p>
<p></p>
<p><a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" rel="noreferrer noopener external" target="_blank">https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)</a></p>
<p>Building on the legacy of theÂ <a href="https://futureworlds.eu/wiki/Club_of_Rome" title="Club of Rome" rel="noreferrer noopener external" target="_blank">Club of Rome</a>Â and its seminalÂ <a href="https://futureworlds.eu/wiki/index.php?title=Limits_to_Growth&amp;action=edit&amp;redlink=1" title="Limits to Growth (page does not exist)" rel="noreferrer noopener external" target="_blank">Limits to Growth</a>Â andÂ <a href="https://futureworlds.eu/wiki/index.php?title=Global_Problematique&amp;action=edit&amp;redlink=1" title="Global Problematique (page does not exist)" rel="noreferrer noopener external" target="_blank">Global Problematique</a>, this international symposium convenes political leaders and systems scientists (paired in dialogue) to confront todayâ€™s most urgent global challenges. ThroughÂ <a href="https://futureworlds.eu/wiki/Structured_Democratic_Dialogue" title="Structured Democratic Dialogue" rel="noreferrer noopener external" target="_blank">Structured Democratic Dialogue</a>Â (SDD), participants will co-design strategies for a thriving, sustainable, and resilient future grounded in fairness, happiness, and respect for humanâ€“nature ethics.</p>
<p>This will not be just a conversation, but a bold step toward global systemic transformation.</p>', 'speaker_series', '2026-06-29T00:00:00', '2026-07-01T23:59:00', 'Pyla Cyprus', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('70e93272-39d1-4562-bb83-0a5e593da188', 'Reimagining our World Systemically - From Problematique to Purposeful Action (2026)', '<p><strong>Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</strong>Â is a Dialogue for the second quarter of the 21st Century, organized back-to-back with theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>.</p>
<p></p>
<p><a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" rel="noreferrer noopener external" target="_blank">https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)</a></p>
<p>Building on the legacy of theÂ <a href="https://futureworlds.eu/wiki/Club_of_Rome" title="Club of Rome" rel="noreferrer noopener external" target="_blank">Club of Rome</a>Â and its seminalÂ <a href="https://futureworlds.eu/wiki/index.php?title=Limits_to_Growth&amp;action=edit&amp;redlink=1" title="Limits to Growth (page does not exist)" rel="noreferrer noopener external" target="_blank">Limits to Growth</a>Â andÂ <a href="https://futureworlds.eu/wiki/index.php?title=Global_Problematique&amp;action=edit&amp;redlink=1" title="Global Problematique (page does not exist)" rel="noreferrer noopener external" target="_blank">Global Problematique</a>, this international symposium convenes political leaders and systems scientists (paired in dialogue) to confront todayâ€™s most urgent global challenges. ThroughÂ <a href="https://futureworlds.eu/wiki/Structured_Democratic_Dialogue" title="Structured Democratic Dialogue" rel="noreferrer noopener external" target="_blank">Structured Democratic Dialogue</a>Â (SDD), participants will co-design strategies for a thriving, sustainable, and resilient future grounded in fairness, happiness, and respect for humanâ€“nature ethics.</p>
<p>This will not be just a conversation, but a bold step toward global systemic transformation.</p>', 'speaker_series', '2026-06-30T00:00:00', '2026-07-02T23:59:00', 'Pyla Cyprus', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('34ee10f2-2a89-4b76-8aa5-fe7d8a5ecfc1', '', '<p>Cybernetics Conversation Annual Event</p>', 'speaker_series', '2026-07-01T00:00:00', '2026-07-03T23:59:00', 'School of Business, Loughborough University', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('4e570566-f0c5-4cfe-adf8-760f030e6763', 'Reimagining our World Systemically - From Problematique to Purposeful Action (2026)', '<p><strong>Reimagining our World Systemically - From Problematique to Purposeful Action (2026)</strong>Â is a Dialogue for the second quarter of the 21st Century, organized back-to-back with theÂ <a href="https://futureworlds.eu/wiki/70th_(2026)_Annual_Meeting_of_the_International_Society_for_the_Systems_Sciences,_Cyprus" title="70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus" rel="noreferrer noopener external" target="_blank">70th (2026) Annual Meeting of the International Society for the Systems Sciences, Cyprus</a>.</p>
<p></p>
<p><a href="https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)" rel="noreferrer noopener external" target="_blank">https://futureworlds.eu/wiki/Reimagining_our_World_Systemically_-_From_Problematique_to_Purposeful_Action_(2026)</a></p>
<p>Building on the legacy of theÂ <a href="https://futureworlds.eu/wiki/Club_of_Rome" title="Club of Rome" rel="noreferrer noopener external" target="_blank">Club of Rome</a>Â and its seminalÂ <a href="https://futureworlds.eu/wiki/index.php?title=Limits_to_Growth&amp;action=edit&amp;redlink=1" title="Limits to Growth (page does not exist)" rel="noreferrer noopener external" target="_blank">Limits to Growth</a>Â andÂ <a href="https://futureworlds.eu/wiki/index.php?title=Global_Problematique&amp;action=edit&amp;redlink=1" title="Global Problematique (page does not exist)" rel="noreferrer noopener external" target="_blank">Global Problematique</a>, this international symposium convenes political leaders and systems scientists (paired in dialogue) to confront todayâ€™s most urgent global challenges. ThroughÂ <a href="https://futureworlds.eu/wiki/Structured_Democratic_Dialogue" title="Structured Democratic Dialogue" rel="noreferrer noopener external" target="_blank">Structured Democratic Dialogue</a>Â (SDD), participants will co-design strategies for a thriving, sustainable, and resilient future grounded in fairness, happiness, and respect for humanâ€“nature ethics.</p>
<p>This will not be just a conversation, but a bold step toward global systemic transformation.</p>', 'speaker_series', '2026-07-01T00:00:00', '2026-07-03T23:59:00', 'Pyla Cyprus', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('ff819846-58ba-4a13-9e74-6d8891ae299b', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-07-15T12:00:00-04:00', '2026-07-15T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('6b82c540-d1c7-477f-9ee2-a7a3861e38a9', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-08-19T12:00:00-04:00', '2026-08-19T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('14b0283a-23e5-4b06-91ea-5c0936ec62be', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-09-16T12:00:00-04:00', '2026-09-16T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('376401c0-f529-4f6f-86e0-beede0a811bc', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-10-21T12:00:00-04:00', '2026-10-21T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('d9d670e4-8162-4f35-8aaf-15d4298d1eb7', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-11-18T12:00:00-05:00', '2026-11-18T13:30:00-05:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('50cb4399-323d-481e-81e8-10edccbe4482', 'VSM-AI Special Integration Group', '', 'speaker_series', '2026-12-16T12:00:00-05:00', '2026-12-16T13:30:00-05:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('b3a62f6f-ea7d-4cf6-bb6e-f815638c383a', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-01-20T12:00:00-05:00', '2027-01-20T13:30:00-05:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('615bd20e-0c35-4eda-b17c-f1187e5fecfa', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-02-17T12:00:00-05:00', '2027-02-17T13:30:00-05:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('fd93187a-e248-4a67-93d4-0f9c4e3091f3', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-03-17T12:00:00-04:00', '2027-03-17T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('8e5028df-7b8d-48e8-a95f-b014caef5a4a', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-04-21T12:00:00-04:00', '2027-04-21T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('2503fddc-40da-45b3-a13b-9967ce5beb01', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-05-19T12:00:00-04:00', '2027-05-19T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('82a91869-03a3-4d90-9c45-6275182e0dcd', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-06-16T12:00:00-04:00', '2027-06-16T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('7f49b0ce-79b3-4bbc-aa10-fa87431df795', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-07-21T12:00:00-04:00', '2027-07-21T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('f79999f8-8cf2-44f4-8a38-e3bcb159dc97', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-08-18T12:00:00-04:00', '2027-08-18T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('8645c275-b987-45a2-ad2b-c0d02b95fe98', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-09-15T12:00:00-04:00', '2027-09-15T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('59864881-fdf7-4add-a5ae-9d88f349b486', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-10-20T12:00:00-04:00', '2027-10-20T13:30:00-04:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('dbf64096-77f4-4082-a6b4-6b730fea43b9', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-11-17T12:00:00-05:00', '2027-11-17T13:30:00-05:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450'),
('570dd598-1c61-42b1-b1ba-02c0641b2f86', 'VSM-AI Special Integration Group', '', 'speaker_series', '2027-12-15T12:00:00-05:00', '2027-12-15T13:30:00-05:00', '', 'c4b1b3b1-1234-4567-8901-abcdef123450');
