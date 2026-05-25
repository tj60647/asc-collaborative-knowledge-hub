import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testWrongPassword() {
  console.log('Attempting to login with WRONG password...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'tj@tjmcleish.com',
    password: 'wrongpassword',
  });
  
  if (error) {
    console.error('LOGIN ERROR:');
    console.error(error);
  } else {
    console.log('LOGIN SUCCESS:');
    console.log(data.user?.id);
  }
}

testWrongPassword();
