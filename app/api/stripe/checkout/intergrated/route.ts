import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

// app/api/checkout2/route.ts
export async function POST(req: NextRequest) {
  try {
    const { items, email, address, promotionCodeId } = await req.json()

    // Calculate subtotal
    const subtotal = items.reduce((acc: number, item: any) => 
      acc + item.price * item.quantity, 0
    )

    let totalAmount = subtotal
    let couponDetails: Stripe.Coupon | null = null

    if (promotionCodeId) {
      try {
        const promotionCode = await stripe.promotionCodes.retrieve(promotionCodeId)
        couponDetails = await stripe.coupons.retrieve(promotionCode.coupon.id)

        if (couponDetails.percent_off) {
          totalAmount = subtotal * (1 - couponDetails.percent_off / 100)
        } else if (couponDetails.amount_off) {
          totalAmount = Math.max(subtotal - (couponDetails.amount_off / 100), 0)
        }
      } catch (error) {
        console.error('Coupon application failed:', error)
        return NextResponse.json({ error: 'Invalid coupon' }, { status: 400 })
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'gbp',
      metadata: { email, address, promotion_code: promotionCodeId || 'none' }
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      discountApplied: !!promotionCodeId
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' }, 
      { status: 500 }
    )
  }
}