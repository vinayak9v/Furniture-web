import { NextResponse } from "next/server";
import db from "@/lib/db";

// ================= GET SINGLE PRODUCT =================
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const [products] = await db.execute(
      `SELECT * FROM products WHERE id = ?`,
      [id]
    );

    if (products.length === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const product = products[0];

    const [images] = await db.execute(
      "SELECT image FROM product_images WHERE productId = ?",
      [id]
    );

    product.images = images.map((img) => img.image);

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// ================= UPDATE PRODUCT (PUT) =================
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      categoryId, name, slug, shortDescription, description, price,
      oldPrice, discount, stock, sku, material, color, dimensions,
      weight, warranty, isFeatured, isBestSeller, status, thumbnail, images
    } = body;

    await db.execute(
      `UPDATE products SET
        categoryId=?, name=?, slug=?, shortDescription=?, description=?,
        price=?, oldPrice=?, discount=?, stock=?, sku=?, material=?,
        color=?, dimensions=?, weight=?, warranty=?, thumbnail=?,
        isFeatured=?, isBestSeller=?, status=?
       WHERE id=?`,
      [
        categoryId, name, slug, shortDescription, description, price,
        oldPrice, discount, stock, sku, material, color, dimensions,
        weight, warranty, thumbnail, isFeatured || 0, isBestSeller || 0,
        status || "ACTIVE", id
      ]
    );

    await db.execute(`DELETE FROM product_images WHERE productId=?`, [id]);

    if (images && images.length > 0) {
      for (let imageUrl of images) {
        if (imageUrl) {
          await db.execute(
            `INSERT INTO product_images (productId, image) VALUES (?,?)`,
            [id, imageUrl]
          );
        }
      }
    }

    return NextResponse.json({ success: true, message: "Product updated successfully" });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
  }
}

// ================= DELETE PRODUCT =================
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await db.execute(`DELETE FROM product_images WHERE productId=?`, [id]);
    await db.execute(`DELETE FROM products WHERE id=?`, [id]);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
  }
}
