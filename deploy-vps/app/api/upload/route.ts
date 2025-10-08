import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check if we're in Vercel production environment or if file system is not available
    const isVercel = process.env.VERCEL === "1";
    const isProduction = process.env.NODE_ENV === "production";
    
    if (isVercel || isProduction) {
      // For Vercel/production, convert to base64 data URL
      // Check file size (5MB limit for base64)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ 
          error: "File too large for base64 storage. Maximum size is 5MB.",
          size: file.size,
          maxSize: 5 * 1024 * 1024
        }, { status: 413 });
      }
      
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
        isDataUrl: true
      });
    } else {
      // Local development - use file system
      const uploadsDir = join(process.cwd(), "public", "uploads");
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory might already exist, that's fine
      }

      // Generate unique filename
      const fileExtension = file.name.split('.').pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = join(uploadsDir, uniqueName);

      // Convert file to buffer and save
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, fileBuffer);

      // Return the public URL
      const publicUrl = `/uploads/${uniqueName}`;
      
      return NextResponse.json({ 
        success: true, 
        url: publicUrl,
        filename: uniqueName,
        isDataUrl: false
      });
    }

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Failed to upload file",
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}