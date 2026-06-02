import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth"; // अपना सही पाथ दें
import db from "@/lib/db"; // Updated Import

// GET: यूजर के सभी एड्रेस मंगाने के लिए
export async function GET(req) {
  try {
    // 1. Headers से Token निकालना
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return NextResponse.json({ success: false, message: "Unauthorized: No token provided" }, { status: 401 });
    
    // 2. Token Verify करना
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });

    // 3. Database Query
    const [addresses] = await db.query(
      `SELECT * FROM addresses WHERE userId = ? ORDER BY isDefault DESC, createdAt DESC`,
      [user.id]
    );

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error("Fetch Addresses Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// POST: नया एड्रेस जोड़ने के लिए
export async function POST(req) {
  try {
    // 1. Headers से Token निकालना
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return NextResponse.json({ success: false, message: "Unauthorized: No token provided" }, { status: 401 });
    
    // 2. Token Verify करना
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });

    // 3. Request Body पार्स करना
    const body = await req.json();
    const { fullName, phone, address, city, state, pincode, country = "India" } = body;

    // 4. Insert into MySQL using 'db'
    const [result] = await db.query(
      `INSERT INTO addresses (userId, fullName, phone, address, city, state, pincode, country) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, fullName, phone, address, city, state, pincode, country]
    );

    const newAddress = {
      id: result.insertId,
      userId: user.id,
      fullName, 
      phone, 
      address, 
      city, 
      state, 
      pincode, 
      country
    };

    return NextResponse.json({ success: true, message: "Address added successfully", address: newAddress });
  } catch (error) {
    console.error("Add Address Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ... (Your existing GET and POST methods here) ...

// UPDATE Address
export async function PUT(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    const { id, fullName, phone, address, city, state, pincode } = await req.json();

    await db.query(
      `UPDATE addresses SET fullName=?, phone=?, address=?, city=?, state=?, pincode=? WHERE id=? AND userId=?`,
      [fullName, phone, address, city, state, pincode, id, user.id]
    );

    return NextResponse.json({ success: true, message: "Address updated" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// DELETE Address
export async function DELETE(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    const { id } = await req.json(); // Read ID from body
    await db.query(`DELETE FROM addresses WHERE id=? AND userId=?`, [id, user.id]);

    return NextResponse.json({ success: true, message: "Address deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}