import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Customer from "@/lib/models/Customer";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/utils/auth";
const SECRET = process.env.JWT_SECRET as string;

// Middleware to verify token
const verifyToken = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, SECRET) as { userId: string };
  } catch {
    return null;
  }
};

// Get user info
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await Customer.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Update user
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password } = await req.json();
    const updateData: { name?: string; email?: string; password?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await hashPassword(password);

    const updatedUser = await Customer.findByIdAndUpdate(decoded.userId, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Delete user
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await Customer.findByIdAndDelete(decoded.userId);
    return NextResponse.json({ message: "Customer deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
