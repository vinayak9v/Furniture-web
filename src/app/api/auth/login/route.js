import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();

    const { email, password } = body;

    const [user] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (user.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Email",
        },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      user[0].password
    );

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Password",
        },
        { status: 400 }
      );
    }

    const token = generateToken(user[0]);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
      },
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