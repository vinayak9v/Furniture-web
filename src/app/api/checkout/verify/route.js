import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth"; // Auth के लिए इम्पोर्ट किया गया
import db from "@/lib/db"; // 'pool' को 'db' से रिप्लेस किया गया है

export async function POST(req) {
  try {
    // 1. Headers से Token निकालना (सुरक्षा के लिए)
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return NextResponse.json({ success: false, message: "Unauthorized: No token provided" }, { status: 401 });
    
    // 2. Token Verify करना
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });

    // 3. Frontend से डेटा रिसीव करना
    // अब frontend सिर्फ orderId (जो 'ORD-...' फॉर्मेट में है) भेज रहा है
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
    }

    // 4. Verify Payment Status from Cashfree API (Server-to-Server)
    const cashfreeResponse = await fetch(`https://sandbox.cashfree.com/pg/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
        "Accept": "application/json"
      }
    });

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      console.error("Cashfree Verification Fetch Error:", cashfreeData);
      return NextResponse.json({ success: false, message: "Failed to fetch order status from gateway" }, { status: 500 });
    }

    // Cashfree में status "PAID" होना चाहिए
    if (cashfreeData.order_status !== "PAID") {
      return NextResponse.json({ success: false, message: "Payment not completed or failed" }, { status: 400 });
    }

    // 5. Update Database
    // Cashfree का internal order id और amount निकाल लेते हैं
    const cfPaymentId = cashfreeData.cf_order_id?.toString() || orderId; 
    const amount = cashfreeData.order_amount;

    // Database से असल 'id' (dbOrderId) निकालते हैं 'orderNumber' के ज़रिये
    const [orders] = await db.query(
      `SELECT id FROM orders WHERE orderNumber = ? AND userId = ?`, 
      [orderId, user.id]
    );

    if (orders.length === 0) {
      return NextResponse.json({ success: false, message: "Order not found in database" }, { status: 404 });
    }

    const dbOrderId = orders[0].id;

    // Update `orders` table
    await db.query(
      `UPDATE orders SET paymentStatus = 'PAID', transactionId = ? WHERE id = ? AND userId = ?`,
      [cfPaymentId, dbOrderId, user.id] 
    );

    // Insert into `payments` table
    await db.query(
      `INSERT INTO payments (orderId, paymentGateway, transactionId, amount, paymentStatus) 
      VALUES (?, 'CASHFREE', ?, ?, 'SUCCESS')`,
      [dbOrderId, cfPaymentId, amount]
    );

    return NextResponse.json({ success: true, message: "Payment Verified Successfully" });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}