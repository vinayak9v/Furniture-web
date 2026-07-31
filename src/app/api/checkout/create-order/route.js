import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth"; // अपना सही पाथ दें
import db from "@/lib/db"; // 'pool' को 'db' से रिप्लेस किया गया है

export async function POST(req) {
  try {
    // 1. Headers से Token निकालना
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

    // 4. Create Order on Cashfree
    const orderNumber = `ORD-${Date.now()}`; // यही हमारा Cashfree Order ID होगा
    
    // Cashfree API Call
    const cashfreeResponse = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID,       // आपकी Cashfree App ID
        "x-client-secret": process.env.CASHFREE_SECRET_KEY, // आपकी Cashfree Secret Key
        "x-api-version": "2023-08-01",                    // Cashfree API Version
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        order_id: orderNumber,
        order_amount: total, // Cashfree में amount सीधा रुपयों में जाता है (x100 करने की ज़रूरत नहीं)
        order_currency: "INR",
        customer_details: {
          customer_id: user.id.toString(),
          customer_name: user.name || "Customer",
          // Cashfree requires a valid phone number. 
          // If you don't have it in the token, you might need to fetch it from the DB or frontend.
          customer_phone: user.phone || "9999999999", 
        }
      })
    });

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      console.error("Cashfree Order Error:", cashfreeData);
      return NextResponse.json({ error: "Failed to initiate payment", details: cashfreeData }, { status: 500 });
    }

    // 5. Database में Order सेव करना
    const [orderResult] = await db.query(
      `INSERT INTO orders 
      (userId, addressId, orderNumber, paymentMethod, paymentStatus, orderStatus, subtotal, shippingCharge, discountAmount, totalAmount, transactionId) 
      VALUES (?, ?, ?, 'ONLINE', 'PENDING', 'PLACED', ?, 0, ?, ?, ?)`,
      [user.id, addressId, orderNumber, subtotal, discount, total, orderNumber] // orderNumber को ही transactionId बना रहे हैं
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
    // Frontend को payment_session_id चाहिए ताकि वो Modal ओपन कर सके
    return NextResponse.json({
      success: true,
      payment_session_id: cashfreeData.payment_session_id,
      order_id: orderNumber,
      dbOrderId: dbOrderId
    });

  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}