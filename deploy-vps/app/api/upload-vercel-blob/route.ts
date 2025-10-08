import { NextRequest, NextResponse } from "next/server";
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check if Vercel Blob is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Return 400 status so client can try next upload method
      return NextResponse.json({ 
        error: "Vercel Blob not configured. Trying next upload method...",
        fallback: true
      }, { status: 400 });
    }

    // Use Vercel Blob for production
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
    
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      filename: filename,
      isDataUrl: false,
      fallback: false
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Failed to upload file",
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
