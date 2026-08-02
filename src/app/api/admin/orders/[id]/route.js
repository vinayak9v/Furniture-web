import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const [orders] = await db.query(`
      SELECT
        o.id, o.orderNumber, o.paymentMethod, o.paymentStatus, o.orderStatus, o.totalAmount, o.createdAt,
        u.name AS customerName, u.email AS customerEmail,
        a.address, a.city, a.state, a.pincode
      FROM orders o
      LEFT JOIN users u ON o.userId = u.id
      LEFT JOIN addresses a ON o.addressId = a.id
      WHERE o.id = ?
    `, [id]);

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const [items] = await db.query(`
      SELECT oi.id, oi.productId, oi.quantity, oi.price, oi.totalPrice, p.name, p.thumbnail
      FROM order_items oi
      LEFT JOIN products p ON oi.productId = p.id
      WHERE oi.orderId = ?
    `, [id]);

    return NextResponse.json({
      success: true,
      order: { ...orders[0], items }
    });

  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;

    const body = await req.json();
    const { orderStatus, paymentStatus } = body;

    const fields = [];
    const values = [];

    if (orderStatus !== undefined) {
      fields.push("orderStatus = ?");
      values.push(orderStatus);
    }
    if (paymentStatus !== undefined) {
      fields.push("paymentStatus = ?");
      values.push(paymentStatus);
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(id);

    await db.query(
      `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
