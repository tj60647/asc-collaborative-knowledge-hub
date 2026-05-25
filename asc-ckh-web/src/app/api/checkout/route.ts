import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with a fallback for local development if the env var is missing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock123', {
  apiVersion: '2026-04-22.dahlia',
});

// Mock Price IDs for development. These must be replaced with real Production Stripe Price IDs.
const PRICE_MAP: Record<string, string> = {
  regular: process.env.NEXT_PUBLIC_STRIPE_PRICE_REGULAR || 'price_mock_regular_100',
  student: process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDENT || 'price_mock_student_40',
  lifetime: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME || 'price_mock_lifetime_750',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, bio, tier, acceptedTerms } = body;

    if (!acceptedTerms) {
      return NextResponse.json({ error: 'Terms must be accepted' }, { status: 400 });
    }

    const priceId = PRICE_MAP[tier];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid membership tier selected' }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      // DEVELOPMENT ONLY: If no real Stripe key is provided, we simulate a successful checkout 
      // by returning a mock URL to prevent the UI from crashing during local MVP testing.
      console.warn("⚠️ STRIPE_SECRET_KEY is missing. Simulating checkout URL for development.");
      return NextResponse.json({ 
        url: `${request.headers.get('origin') || 'http://localhost:3000'}/?checkout_mock=success` 
      });
    }

    // 1. Create a Stripe Customer (or search for an existing one in a full production app)
    const customer = await stripe.customers.create({
      email: email,
      name: `${firstName} ${lastName}`,
      metadata: {
        firstName,
        lastName,
        bio: bio || '',
        tier,
      }
    });

    // 2. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: tier === 'lifetime' ? 'payment' : 'subscription',
      success_url: `${request.headers.get('origin')}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/join?checkout=cancelled`,
      metadata: {
        firstName,
        lastName,
        email,
        bio,
      },
      // Require billing address for compliance
      billing_address_collection: 'required', 
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error generating checkout session' },
      { status: 500 }
    );
  }
}
