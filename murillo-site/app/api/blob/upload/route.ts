import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const folder = String(form.get("folder") || "uploads");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
    const pathname = `${folder}/${Date.now()}-${safeName}`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
    });
  } catch (error) {
    console.error("Blob upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed." },
      { status: 500 }
    );
  }
}