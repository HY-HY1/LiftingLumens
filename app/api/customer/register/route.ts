import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';  // Ensure this path is correct
import Customer from '@/lib/models/Customer';  // Ensure this path is correct

// POST method handler
export async function POST(req: Request) {
  const { firstName, lastName, email, password } = await req.json();

  // Validate the input
  if (!firstName || !lastName || !email) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  const existingCustomer = await Customer.findOne({email: email})
  if (existingCustomer) {
    return NextResponse.json({ message: 'Customer already exists, Wont create new user' }, { status: 200 });
  }

  try {
    // Connect to the database
    await connectToDatabase()

    // Create a new customer instance
    const customer = new Customer({
      firstName,
      lastName,
      email,
      ...(password && { password }),
    });

    // Save the customer to the database
    await customer.save();

    return NextResponse.json({ message: 'Customer registered successfully' }, { status: 201 });
  } catch (err) {
    console.error('Error saving customer:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Allow only POST method, others will return a 405
export async function OPTIONS() {
  return NextResponse.json(null, { status: 200 });
}
