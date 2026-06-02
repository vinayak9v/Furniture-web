import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { verifyToken } from "@/lib/auth"; // अपना सही पाथ दें
import db from "@/lib/db"; // 'pool' को 'db' से रिप्लेस किया गया है

// Razorpay Initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    // 1. Headers से Token निकालना (चूंकि अब हम localStorage से भेज रहे हैं)
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    
    // 2. Token Verify करना
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    
    // 3. Frontend से डेटा रिसीव करना
    const { items, subtotal, discount, total, addressId } = await req.json();

    if (!addressId) return NextResponse.json({ error: "Address is required" }, { status: 400 });
    if (!items || items.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    // 4. Create Order on Razorpay
    const options = {
      amount: Math.round(total * 100), // अमाउंट पैसे (paise) में होना चाहिए
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    const orderNumber = `ORD-${Date.now()}`;
    
    // 5. Database में Order सेव करना (db.query का इस्तेमाल)
    const [orderResult] = await db.query(
      `INSERT INTO orders 
      (userId, addressId, orderNumber, paymentMethod, paymentStatus, orderStatus, subtotal, shippingCharge, discountAmount, totalAmount, transactionId) 
      VALUES (?, ?, ?, 'ONLINE', 'PENDING', 'PLACED', ?, 0, ?, ?, ?)`,
      [user.id, addressId, orderNumber, subtotal, discount, total, razorpayOrder.id]
    );
    
    const dbOrderId = orderResult.insertId;

    // 6. order_items टेबल में आइटम्स सेव करना
    const orderItemsValues = items.map(item => [
      dbOrderId, 
      item.id, // productId
      item.quantity, 
      item.price, 
      item.price * item.quantity // totalPrice
    ]);

    await db.query(
      `INSERT INTO order_items (orderId, productId, quantity, price, totalPrice) VALUES ?`,
      [orderItemsValues]
    );

    // 7. Frontend को रिस्पॉन्स भेजना
    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      dbOrderId: dbOrderId
    });

  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}