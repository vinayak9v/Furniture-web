import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, password, phone } = body;

    const [existing] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users(name,email,password,phone)
       VALUES(?,?,?,?)`,
      [name, email, hashPassword, phone]
    );

    return NextResponse.json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}