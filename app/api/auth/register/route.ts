import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Customer from "@/lib/models/Customer";
import { hashPassword } from "@/utils/auth";
import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { firstName, lastName, email, password } = await req.json();

        const existingCustomer = await Customer.findOne({ email: email });

        if (existingCustomer && !existingCustomer.password) {

            // Add email auth

          await Customer.updateOne(
            { email: email },
            { $set: { password: await hashPassword(password) } }
          );

          // Send to Dashboard
          return NextResponse.json({ message: "User created" }, { status: 200 });
        }

        if (existingCustomer && existingCustomer.password) {
            // Redirect to login
            return NextResponse.json({ error: "User already exists" },
                { status: 400 });
            }

        const newCustomer = new Customer({
            firstName,
            lastName,
            email,
            password: await hashPassword(password),
        })

        return NextResponse.json({ message: "User created" }, { status: 200 });
        // Redirect to login

        await newCustomer.save();
        

    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}