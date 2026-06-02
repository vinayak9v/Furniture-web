// app/api/categories/route.js

import { NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs";
import path from "path";

// ================= GET ALL =================
export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM categories ORDER BY id DESC"
    );

    return NextResponse.json({
      success: true,
      categories: rows,
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

