import { NextResponse } from "next/server";
import db from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

// ================= GET ALL =================
export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM categories ORDER BY id DESC"
    );

    return NextResponse.json({
      success: true,
      categories: rows,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

// ================= CREATE CATEGORY =================
export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const image = formData.get("image");

    if (!name || !image) {
      return NextResponse.json(
        { success: false, message: "Name and image required" },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image allowed" },
        { status: 400 }
      );
    }

    if (image.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Max 2MB image allowed" },
        { status: 400 }
      );
    }

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

    const [result] = await db.execute(
      `INSERT INTO categories (name,image) VALUES (?,?)`,
      [name, imageUrl]
    );

    return NextResponse.json({
      success: true,
      message: "Category created",
      image: imageUrl,
      id: result.insertId,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
