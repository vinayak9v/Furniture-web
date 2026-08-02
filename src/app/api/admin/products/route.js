import { NextResponse } from "next/server";
import db from "@/lib/db";

// ================= GET ALL PRODUCTS =================
export async function GET() {
  try {
    const [products] = await db.execute(`
      SELECT
        p.*,
        c.name AS categoryName
      FROM products p
      LEFT JOIN categories c
      ON p.categoryId = c.id
      ORDER BY p.id DESC
    `);

    // ================= GET IMAGES =================
    for (let product of products) {
      const [images] = await db.execute(
        "SELECT * FROM product_images WHERE productId=?",
        [product.id]
      );

      product.images = images;
    }

    return NextResponse.json({
      success: true,
      products,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

// ================= CREATE PRODUCT =================
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      categoryId,
      name,
      slug,
      shortDescription,
      description,
      price,
      oldPrice,
      discount,
      stock,
      sku,
      material,
      color,
      dimensions,
      weight,
      warranty,
      isFeatured,
      isBestSeller,
      status,
      thumbnail,
      images
    } = body;

    if (!name || !price || !thumbnail) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      `
        INSERT INTO products (
          categoryId,
          name,
          slug,
          shortDescription,
          description,
          price,
          oldPrice,
          discount,
          stock,
          sku,
          material,
          color,
          dimensions,
          weight,
          warranty,
          thumbnail,
          isFeatured,
          isBestSeller,
          status
        )
        VALUES (
          ?,?,?,?,?,?,?,?,?,?,
          ?,?,?,?,?,?,?,?,?
        )
        `,
      [
        categoryId,
        name,
        slug,
        shortDescription,
        description,
        price,
        oldPrice,
        discount,
        stock,
        sku,
        material,
        color,
        dimensions,
        weight,
        warranty,
        thumbnail,
        isFeatured || 0,
        isBestSeller || 0,
        status || "ACTIVE",
      ]
    );

    const productId = result.insertId;

    if (images && images.length > 0) {
      for (let imageUrl of images) {
        if (imageUrl) {
          await db.execute(
            `INSERT INTO product_images (productId,image) VALUES (?,?)`,
            [productId, imageUrl]
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      productId,
    });

  } catch (error) {
    console.error("Backend Error:", error);

    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
