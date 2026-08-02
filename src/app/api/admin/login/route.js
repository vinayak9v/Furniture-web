import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and Password required" },
        { status: 400 }
      );
    }

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ? AND role = 'ADMIN'",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    const admin = rows[0];

    if (admin.status === "BLOCKED") {
      return NextResponse.json(
        { success: false, message: "Account blocked" },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          profileImage: admin.profileImage,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("ADMIN LOGIN ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
