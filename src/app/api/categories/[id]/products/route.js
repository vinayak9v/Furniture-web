import { NextResponse } from "next/server";
import db from "@/lib/db"; 

export async function GET(req, { params }) {
  try {
    const { id } = params;

    // कैटेगरी ID के आधार पर प्रोडक्ट्स लाना
    const [products] = await db.query(
      `SELECT p.*, c.name as categoryName 
       FROM products p 
       LEFT JOIN categories c ON p.categoryId = c.id 
       WHERE p.categoryId = ? AND p.status = 'ACTIVE'`,
      [id]
    );

    // अगर उस कैटेगरी की जानकारी भी भेजनी हो
    const [categoryInfo] = await db.query(`SELECT name FROM categories WHERE id = ?`, [id]);
    const categoryName = categoryInfo.length > 0 ? categoryInfo[0].name : "Unknown Category";

    return NextResponse.json({ 
      success: true, 
      categoryName,
      products 
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}