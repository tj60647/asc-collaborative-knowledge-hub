import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock123', {
  apiVersion: '2026-04-22.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock123';

// Initialize Supabase Admin client to bypass RLS for provisioning
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock_service_key'
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn("⚠️ STRIPE_WEBHOOK_SECRET is missing. Bypassing signature verification for local testing.");
      event = JSON.parse(body);
    } else {
      if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
      }
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
      }
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const { firstName, lastName, email, bio } = session.metadata || {};
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string | undefined;

      if (!email || !firstName || !lastName) {
        console.error("Webhook Error: Missing required metadata to provision user.");
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      console.log(`Provisioning user for successful checkout: ${email}`);

      // 1. Create the user in Supabase Auth (Silent Provisioning)
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: { first_name: firstName, last_name: lastName },
        password: Math.random().toString(36).slice(-10) + 'A1!', // Generate a secure random password
      });

      if (authError && authError.message !== 'User already registered') {
        console.error('Supabase Auth Error:', authError);
        return NextResponse.json({ error: 'Failed to provision auth user' }, { status: 500 });
      }

      let userId = authData?.user?.id;

      // If user already registered, fetch their ID
      if (!userId) {
        const { data: existingUsers, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
        if (fetchError) {
           console.error('Failed to list users to find existing ID:', fetchError);
           return NextResponse.json({ error: 'Failed to fetch existing user' }, { status: 500 });
        }
        const user = existingUsers.users.find(u => u.email === email);
        if (user) {
          userId = user.id;
        } else {
          return NextResponse.json({ error: 'Could not resolve User ID' }, { status: 500 });
        }
      }

      // 2. Insert or update the public.profiles record
      const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        bio: bio || null,
        role: 'member',
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId || null,
        subscription_status: 'active',
        discoverability_opt_in: false, // Always default to false for privacy
      });

      if (profileError) {
        console.error('Supabase Profile Insert Error:', profileError);
        return NextResponse.json({ error: 'Failed to insert profile record' }, { status: 500 });
      }

      console.log(`Successfully provisioned profile for ${email}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook route error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
