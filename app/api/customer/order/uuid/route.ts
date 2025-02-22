import { NextResponse } from 'next/server';
import Order from '@/lib/models/Order';
import connectToDatabase from '@/lib/mongoose';

export async function GET(request: Request) {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get('uuid');

    if (!uuid) {
        return NextResponse.json({ success: false, message: 'UUID is required' }, { status: 400 });
    }

    try {
        const order = await Order.findOne({ uuid });
        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: order }, { status: 200 });
    } catch (error) {
        console.error('Error fetching order:', error); // Added detailed logging
        return NextResponse.json({ success: false, message: 'Error fetching order' }, { status: 400 });
    }
}