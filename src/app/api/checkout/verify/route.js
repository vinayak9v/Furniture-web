import { NextResponse } from "next/server";
import crypto from "crypto";
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
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      dbOrderId,
      amount 
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;

    // 4. Verify Signature (Razorpay का लॉजिक)
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: "Invalid Signature" }, { status: 400 });
    }

    // 5. Update Database (Payment Success) - db.query का इस्तेमाल
    // Update `orders` table
    await db.query(
      `UPDATE orders SET paymentStatus = 'PAID', transactionId = ? WHERE id = ? AND userId = ?`,
      [razorpay_payment_id, dbOrderId, user.id] // user.id ऐड किया ताकि कोई दूसरे का आर्डर अपडेट न कर सके
    );

    // Insert into `payments` table
    await db.query(
      `INSERT INTO payments (orderId, paymentGateway, transactionId, amount, paymentStatus) 
      VALUES (?, 'RAZORPAY', ?, ?, 'SUCCESS')`,
      [dbOrderId, razorpay_payment_id, amount]
    );

    return NextResponse.json({ success: true, message: "Payment Verified Successfully" });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}