import { NextResponse } from "next/server";
import db from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

// ================= GET SINGLE =================
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const [rows] = await db.execute("SELECT * FROM categories WHERE id=?", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, category: rows[0] });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// ================= UPDATE (Fixed for FormData) =================
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    const name = formData.get("name");
    const image = formData.get("image"); // Yeh nayi file ho sakti hai ya null

    if (!name) {
      return NextResponse.json({ success: false, message: "Name required" }, { status: 400 });
    }

    // Agar user ne nayi image upload ki hai
    if (image && image.size > 0 && typeof image !== 'string') {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      const imageUrl = uploadResult.secure_url;
      await db.execute("UPDATE categories SET name=?, image=? WHERE id=?", [name, imageUrl, id]);
    }
    // Agar image change nahi ki, sirf name change kiya hai
    else {
      await db.execute("UPDATE categories SET name=? WHERE id=?", [name, id]);
    }

    return NextResponse.json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await db.execute("DELETE FROM categories WHERE id=?", [id]);
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
