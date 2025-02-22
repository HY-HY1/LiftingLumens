// app/api/verifyCoupon/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(req: Request) {
  const { couponCode } = await req.json();

  try {
    const promotionCodes = await stripe.promotionCodes.list({
      code: couponCode,
      active: true,
      limit: 1,
      expand: ['data.coupon']
    });

    if (!promotionCodes.data.length) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
    }

    const promotionCode = promotionCodes.data[0];
    const coupon = promotionCode.coupon as Stripe.Coupon;

    // Validate coupon expiration
    const now = Math.floor(Date.now() / 1000);
    if (coupon.redeem_by && coupon.redeem_by < now) {
      return NextResponse.json({ error: 'Expired coupon' }, { status: 400 });
    }

    // Check redemption limits
    if (promotionCode.max_redemptions && 
        promotionCode.times_redeemed >= promotionCode.max_redemptions) {
      return NextResponse.json({ error: 'Coupon fully redeemed' }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      promotionCodeId: promotionCode.id,
      discount: {
        type: coupon.percent_off ? 'percentage' : 'fixed',
        value: coupon.percent_off || coupon.amount_off
      }
    });

  } catch (error) {
    console.error('Coupon verification failed:', error);
    return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
  }
}