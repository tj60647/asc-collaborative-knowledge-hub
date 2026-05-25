import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// We must use the SERVICE_ROLE key to bypass RLS and Auth rules
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Ensure you have this in .env.local
);

const personas = [
  {
    email: 'admin@asc-cybernetics.org',
    password: 'password123',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'admin',
    titlePrefix: null,
  },
  {
    email: 'senior.researcher@asc-cybernetics.org',
    password: 'password123',
    firstName: 'Aris',
    lastName: 'Scholar',
    role: 'member',
    titlePrefix: 'Dr.',
  },
  {
    email: 'new.student@asc-cybernetics.org',
    password: 'password123',
    firstName: 'Jordan',
    lastName: 'Learner',
    role: 'member',
    titlePrefix: null,
  },
  {
    email: 'board.member@asc-cybernetics.org',
    password: 'password123',
    firstName: 'Elena',
    lastName: 'Director',
    role: 'member',
    titlePrefix: 'Prof.',
  },
];

async function seedAuth() {
  console.log('Seeding Supabase Auth with admin.createUser()...');

  for (const persona of personas) {
    // 1. Create the user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: persona.email,
      password: persona.password,
      email_confirm: true,
      user_metadata: {
        first_name: persona.firstName,
        last_name: persona.lastName,
      }
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`User ${persona.email} already exists.`);
        // Note: we could fetch the user here and update their profile if needed
      } else {
        console.error(`Failed to create ${persona.email}:`, authError.message);
      }
      continue;
    }

    const userId = authData.user.id;
    console.log(`Created user ${persona.email} with ID: ${userId}`);

    // 2. The database trigger 'handle_new_user' should have created the profile.
    // Let's update the role and title prefix.
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        role: persona.role,
        title_prefix: persona.titlePrefix,
      })
      .eq('id', userId);

    if (profileError) {
      console.error(`Failed to update profile for ${persona.email}:`, profileError.message);
    } else {
      console.log(`Updated profile for ${persona.email}`);
    }
  }
  console.log('Auth seeding complete.');
}

seedAuth();
