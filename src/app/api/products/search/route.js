// app/api/products/search/route.js
import { NextResponse } from "next/server";
import db from "../../../../lib/db"; // अपने db पाथ के अनुसार इसे एडजस्ट करें

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    // अगर क्वेरी खाली है तो खाली एरे भेजें
    if (!query.trim()) {
      return NextResponse.json({ success: true, products: [] });
    }

    const searchWildcard = `%${query}%`;

    // केवल ACTIVE प्रोडक्ट्स में नाम, शार्ट डिस्क्रिप्शन, SKU, कलर या मटेरियल के आधार पर सर्च करें
    const [products] = await db.execute(
      `SELECT id, name, slug, price, oldPrice, discount, thumbnail 
       FROM products 
       WHERE status = 'ACTIVE' 
       AND (name LIKE ? OR shortDescription LIKE ? OR sku LIKE ? OR color LIKE ? OR material LIKE ?)
       LIMIT 8`,
      [searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard]
    );

    return NextResponse.json({
      success: true,
      products,
    });

  } catch (error) {
    console.error("Search API Backend Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}