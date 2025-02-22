import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Address from "@/lib/models/Address";

export async function POST(req: Request) {
  const { email, postcode, city, street } = await req.json();  // Expect "street" here

  // Validate the input
  if (!email || !postcode || !city || !street) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    // Use the "street" field directly in the Address model
    const newAddress = new Address({ email, postcode, city, street });

    await newAddress.save();

    return NextResponse.json(
      { message: "Address saved successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving address:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 200 });
}
