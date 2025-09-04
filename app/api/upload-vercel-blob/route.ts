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
      // Fallback to compressed base64 if Vercel Blob is not configured
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Compress image if it's too large (>1MB)
      let finalBuffer = buffer;
      if (buffer.length > 1024 * 1024) { // 1MB
        // For now, just return an error for large files
        return NextResponse.json({ 
          error: "File too large for base64 storage. Please set up Vercel Blob storage or use a smaller image.",
          size: buffer.length,
          maxSize: 1024 * 1024
        }, { status: 413 });
      }
      
      const base64 = finalBuffer.toString('base64');
      const mimeType = file.type || 'image/jpeg';
      const dataUrl = `data:${mimeType};base64,${base64}`;
      
      const fileExtension = file.name.split('.').pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      
      return NextResponse.json({ 
        success: true, 
        url: dataUrl,
        filename: uniqueName,
        isDataUrl: true,
        fallback: true,
        size: buffer.length
      });
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
