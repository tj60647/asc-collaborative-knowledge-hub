import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const personas = [
  { email: 'admin@asc-cybernetics.org', password: 'password123', first_name: 'System', last_name: 'Administrator', title_prefix: 'Mx.' },
  { email: 'senior.researcher@asc-cybernetics.org', password: 'password123', first_name: 'Aris', last_name: 'Scholar', title_prefix: 'Dr.' },
  { email: 'new.student@asc-cybernetics.org', password: 'password123', first_name: 'Jordan', last_name: 'Learner', title_prefix: 'None' },
  { email: 'board.member@asc-cybernetics.org', password: 'password123', first_name: 'Elena', last_name: 'Director', title_prefix: 'Prof.' },
]

const dummyUsers = Array.from({ length: 11 }, (_, i) => ({
  email: `member${i+1}@example.com`,
  password: 'password123',
  first_name: `Member${i+1}`,
  last_name: 'Test',
  title_prefix: 'None'
}))

const allUsers = [...personas, ...dummyUsers]

async function seed() {
  console.log('Seeding 15 users via Auth API...')
  
  let adminId = null;

  for (const user of allUsers) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          first_name: user.first_name,
          last_name: user.last_name,
        }
      }
    })
    
    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`User ${user.email} already exists.`)
      } else {
        console.error(`Error creating ${user.email}:`, error.message)
      }
    } else {
      console.log(`Created user: ${user.email}`)
      if (user.email === 'admin@asc-cybernetics.org' && data.user) {
        adminId = data.user.id
      }
    }
  }

  console.log('Users created.')
  console.log('Run the following SQL to make the admin user an actual admin, update their titles, and generate events:')
  
  const sqlScript = `
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
  `
  
  fs.writeFileSync('scripts/seed_data.sql', sqlScript)
  console.log('Wrote scripts/seed_data.sql. Please execute it via: npx supabase db query --linked --file scripts/seed_data.sql')
}

seed()
