import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function cleanFolderName(value: FormDataEntryValue | null) {
const raw = typeof value === "string" && value.trim() ? value.trim() : "uploads";

return raw
.replace(/\\/g, "/")
.split("/")
.map((part) =>
part
.toLowerCase()
.replace(/[^a-z0-9-_]/g, "-")
.replace(/-+/g, "-")
.replace(/^-|-$/g, "")
)
.filter(Boolean)
.join("/") || "uploads";
}

function cleanFileName(name: string) {
const fallback = "image";
const safe = name
.toLowerCase()
.replace(/\s+/g, "-")
.replace(/[^a-z0-9._-]/g, "-")
.replace(/-+/g, "-")
.replace(/^-|-$/g, "");

return safe || fallback;
}

export async function POST(request: Request) {
try {
const formData = await request.formData();

const file = formData.get("file");

if (!(file instanceof File)) {
return NextResponse.json(
{
success: false,
error: "No image file uploaded.",
},
{ status: 400 }
);
}

if (!file.type.startsWith("image/")) {
return NextResponse.json(
{
success: false,
error: "Only image uploads are allowed.",
},
{ status: 400 }
);
}

const folder = cleanFolderName(formData.get("folder"));
const fileName = cleanFileName(file.name);
const uniqueName = `${folder}/${Date.now()}-${Math.random()
.toString(36)
.slice(2, 10)}-${fileName}`;

const blob = await put(uniqueName, file, {
access: "public",
addRandomSuffix: false,
contentType: file.type || "image/jpeg",
});

return NextResponse.json({
success: true,
url: blob.url,
src: blob.url,
pathname: blob.pathname,
contentType: blob.contentType,
uploadedAt: new Date().toISOString(),
});
} catch (error) {
console.error("POST /api/blob/upload failed:", error);

return NextResponse.json(
{
success: false,
error: "Blob upload failed.",
},
{ status: 500 }
);
}
}
