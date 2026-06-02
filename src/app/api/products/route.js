import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req) {
  try {
    // Get page from query
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const offset = (page - 1) * limit;

    // Get products
    const [products] = await db.query(
      `
      SELECT 
        id,
        thumbnail,
        price,
        oldPrice,
        discount,
        name,
        slug
      FROM products
      ORDER BY id DESC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    // Total products count
    const [countResult] = await db.query(
      "SELECT COUNT(*) as total FROM products"
    );

    const total = countResult[0].total;

    return NextResponse.json({
      success: true,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },

      products,
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