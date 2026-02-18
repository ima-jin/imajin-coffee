/**
 * POST /api/checkout
 * 
 * Creates a Stripe Checkout session for a coffee tip.
 * Simple version - just amount, no database.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3009';

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Minimum amount is $1' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Support Imajin',
            description: 'Thank you for supporting sovereign infrastructure!',
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      success_url: `${BASE_URL}/success`,
      cancel_url: BASE_URL,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
