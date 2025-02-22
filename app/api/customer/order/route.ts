import { NextResponse } from 'next/server';
import Order from '@/lib/models/Order';
import connectToDatabase from '@/lib/mongoose';

export async function GET() {
  await connectToDatabase();

  try {
    const orders = await Order.find({});
    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error); // Added detailed logging
    return NextResponse.json({ success: false, message: 'Error fetching orders' }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    // Extract email and clientSecret from the request body
    const { email, clientSecret } = await req.json();

    if (!email || !clientSecret) {
      return NextResponse.json(
        { success: false, message: 'Email and client secret are required' },
        { status: 400 }
      );
    }

    // Create a new order with email and clientSecret
    const order = await Order.create({ email, clientSecret });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error:any) {
    console.error('Error creating order:', error); // Detailed logging
    return NextResponse.json({ success: false, message: 'Error creating order', error: error.message }, { status: 400 });
  }
}
