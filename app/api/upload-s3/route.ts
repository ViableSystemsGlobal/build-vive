import { NextRequest, NextResponse } from 'next/server';
import { s3 } from '../../lib/s3';

export async function POST(request: NextRequest) {
  try {
    if (!s3.isConfigured()) {
      return NextResponse.json(
        { error: 'S3 not configured. Please set AWS credentials and S3_BUCKET_NAME.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `uploads/${timestamp}-${randomString}.${fileExtension}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const url = await s3.uploadFile(fileName, buffer, file.type);

    return NextResponse.json({
      success: true,
      url: url,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('S3 upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
