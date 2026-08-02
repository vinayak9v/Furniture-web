import { NextResponse } from "next/server";
import db from "../../../../lib/db";

export async function GET(req, { params }) {
  try {

    const { slug } = await params;

    // ================= GET PRODUCT =================
    const [products] = await db.execute(
      `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.shortDescription,
        p.description,
        p.price,
        p.oldPrice,
        p.discount,
        p.stock,
        p.sku,
        p.material,
        p.color,
        p.dimensions,
        p.weight,
        p.warranty,
        p.thumbnail,
        p.isFeatured,
        p.isBestSeller,
        p.status,
        p.createdAt,

        c.id AS categoryId,
        c.name AS categoryName,
        c.image AS categoryImage

      FROM products p

      LEFT JOIN categories c
      ON p.categoryId = c.id

      WHERE p.slug = ?
      `,
      [slug]
    );

    // ================= PRODUCT NOT FOUND =================
    if (products.length === 0) {

      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    const product = products[0];

    // ================= GET PRODUCT IMAGES =================
    const [images] = await db.execute(
      `
      SELECT 
        id,
        image,
        createdAt
      FROM product_images
      WHERE productId = ?
      ORDER BY id DESC
      `,
      [product.id]
    );

    product.images = images;

    return NextResponse.json({
      success: true,
      product,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}