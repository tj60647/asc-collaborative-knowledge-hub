import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testSignUp() {
  console.log('Attempting to sign up...');
  const { data, error } = await supabase.auth.signUp({
    email: 'admin10@asc-cybernetics.org',
    password: 'password123',
    options: {
      data: {
        first_name: 'Test',
        last_name: 'User'
      }
    }
  });
  
  if (error) {
    console.error('SIGNUP ERROR:');
    console.error(error);
  } else {
    console.log('SIGNUP SUCCESS:');
    console.log(data.user?.id);
  }
}

testSignUp();
