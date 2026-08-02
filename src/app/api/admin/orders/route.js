import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET(req) {
  try {

    // ================= PAGINATION =================
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    const offset = (page - 1) * limit;

    // ================= TOTAL ORDERS =================
    const [countResult] = await db.execute(`
      SELECT COUNT(*) as total
      FROM orders
    `);

    const totalOrders = countResult[0].total;

    const totalPages = Math.ceil(totalOrders / limit);

    // ================= FETCH ORDERS =================
    const [orders] = await db.query(`
      SELECT
        o.id,
        o.orderNumber,
        o.paymentMethod,
        o.paymentStatus,
        o.orderStatus,
        o.totalAmount,
        o.createdAt,

        u.name AS customerName,
        u.email AS customerEmail,

        a.address,
        a.city,
        a.state,
        a.pincode

      FROM orders o

      LEFT JOIN users u
      ON o.userId = u.id

      LEFT JOIN addresses a
      ON o.addressId = a.id

      ORDER BY o.createdAt DESC

      LIMIT ? OFFSET ?
    `, [limit, offset]);

    // ================= RESPONSE =================
    return NextResponse.json({
      success: true,

      orders,

      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
      },
    });

  } catch (error) {

    console.error("Error fetching orders:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
        error: error.message
      },
      { status: 500 }
    );
  }
}
