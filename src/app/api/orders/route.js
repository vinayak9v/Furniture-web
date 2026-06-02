import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });

    // ऑर्डर्स लाएं
    const [orders] = await db.query(
      `SELECT id, orderNumber, totalAmount, orderStatus, createdAt 
       FROM orders WHERE userId = ? ORDER BY createdAt DESC`,
      [user.id]
    );

    // हर आर्डर का पहला आइटम (नाम और इमेज दिखाने के लिए)
    for (let order of orders) {
      const [items] = await db.query(
        `SELECT p.name, p.thumbnail, p.color 
         FROM order_items oi 
         JOIN products p ON oi.productId = p.id 
         WHERE oi.orderId = ? LIMIT 1`,
        [order.id]
      );
      if (items.length > 0) {
        order.itemName = items[0].name;
        order.image = items[0].thumbnail;
        order.color = items[0].color || "blue"; // डिफ़ॉल्ट कलर बैज के लिए
      }
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}