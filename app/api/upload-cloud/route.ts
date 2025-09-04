import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // For now, we'll use a simple base64 approach that works on Vercel
    // In production, you might want to use services like:
    // - Cloudinary
    // - AWS S3
    // - Vercel Blob Storage
    // - Uploadcare
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    // Generate unique filename for reference
    const fileExtension = file.name.split('.').pop();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    
    return NextResponse.json({ 
      success: true, 
      url: dataUrl,
      filename: uniqueName,
      isDataUrl: true,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Failed to upload file",
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
