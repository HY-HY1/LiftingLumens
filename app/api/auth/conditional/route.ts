import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Customer from "@/lib/models/Customer";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { email } = await req.json();

        // Check if customer exists in the system (either with or without password)
        const existingCustomer = await Customer.findOne({ email: email });

        // Case 1: Customer exists but has no password set
        if (existingCustomer && !existingCustomer.password) {
            return NextResponse.json(
                { message: "User exists but has no password. Proceed with password setup." },
                { status: 200 }
            );
        }

        // Case 2: Customer exists and already has a password set
        if (existingCustomer && existingCustomer.password) {
            return NextResponse.json(
                { error: "User already exists and is fully registered. Please log in." },
                { status: 400 }
            );
        }

        // Case 3: Customer does not exist in the system (email not found)
        return NextResponse.json(
            { message: "Email does not exist. Please complete full registration." },
            { status: 404 }
        );

    } catch (error: any) {
        return NextResponse.json({ error: "Server error occurred." }, { status: 500 });
    }
}
