import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET() {
  try {
    const query = `
      SELECT id, name, email, phone, profileImage, role, status, createdAt
      FROM users
      ORDER BY createdAt DESC
    `;

    const [rows] = await db.query(query);

    return NextResponse.json(
      { success: true, data: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
