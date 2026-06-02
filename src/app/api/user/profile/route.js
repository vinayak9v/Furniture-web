import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";

// GET Profile
export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });

    const [rows] = await db.query(`SELECT id, name, email, phone, createdAt FROM users WHERE id = ?`, [user.id]);
    if (rows.length === 0) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, profile: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// UPDATE Name
export async function PUT(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });

    const { name } = await req.json();
    if (!name) return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });

    await db.query(`UPDATE users SET name = ? WHERE id = ?`, [name, user.id]);

    return NextResponse.json({ success: true, message: "Name updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}