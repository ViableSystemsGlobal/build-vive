import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { writeFileSync } from "fs";

const DATA_DIR = join(process.cwd(), "data");
const KNOWLEDGE_BASE_FILE = join(DATA_DIR, "knowledge-base.json");
const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

interface KnowledgeBaseDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  fileSize: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const file = formData.get('file') as File;
    
    if (!title || !description || !category || !file) {
      return NextResponse.json({ 
        error: "Missing required fields: title, description, category, or file" 
      }, { status: 400 });
    }
    
    // Create uploads directory if it doesn't exist
    try {
      await mkdir(UPLOADS_DIR, { recursive: true });
    } catch (error) {
      console.log("Uploads directory already exists");
    }
    
    // Create data directory if it doesn't exist
    try {
      await mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
      console.log("Data directory already exists");
    }
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
    const filePath = join(UPLOADS_DIR, uniqueFileName);
    
    // Save file to uploads directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    writeFileSync(filePath, buffer);
    
    // Create document record
    const document: KnowledgeBaseDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      category,
      fileName: file.name,
      fileUrl: `/uploads/${uniqueFileName}`,
      uploadDate: new Date().toISOString(),
      fileSize: file.size
    };
    
    // Read existing knowledge base
    let existingDocs: KnowledgeBaseDocument[] = [];
    try {
      const existingData = await readFile(KNOWLEDGE_BASE_FILE, "utf-8");
      existingDocs = JSON.parse(existingData);
    } catch (error) {
      console.log("No existing knowledge base file, starting fresh");
    }
    
    // Add new document
    existingDocs.push(document);
    
    // Save updated knowledge base
    await writeFile(KNOWLEDGE_BASE_FILE, JSON.stringify(existingDocs, null, 2));
    
    console.log(`📚 Document uploaded: ${document.title}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Document uploaded successfully",
      document
    });
    
  } catch (error) {
    console.error('Failed to upload document:', error);
    return NextResponse.json({ 
      error: "Failed to upload document", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    // Create data directory if it doesn't exist
    try {
      await mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
      console.log("Data directory already exists");
    }
    
    // Read existing knowledge base
    let existingDocs: KnowledgeBaseDocument[] = [];
    try {
      const existingData = await readFile(KNOWLEDGE_BASE_FILE, "utf-8");
      existingDocs = JSON.parse(existingData);
    } catch (error) {
      console.log("No existing knowledge base file found");
    }
    
    return NextResponse.json({
      success: true,
      documents: existingDocs,
      total: existingDocs.length
    });
    
  } catch (error) {
    console.error('Failed to read knowledge base:', error);
    return NextResponse.json({ 
      error: "Failed to read knowledge base", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json({ 
        error: "Document ID is required" 
      }, { status: 400 });
    }
    
    // Read existing knowledge base
    let existingDocs: KnowledgeBaseDocument[] = [];
    try {
      const existingData = await readFile(KNOWLEDGE_BASE_FILE, "utf-8");
      existingDocs = JSON.parse(existingData);
    } catch (error) {
      return NextResponse.json({ 
        error: "Knowledge base not found" 
      }, { status: 404 });
    }
    
    // Find document to delete
    const documentIndex = existingDocs.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
      return NextResponse.json({ 
        error: "Document not found" 
      }, { status: 404 });
    }
    
    const document = existingDocs[documentIndex];
    
    // Delete file from uploads directory
    try {
      const filePath = join(process.cwd(), "public", document.fileUrl);
      await unlink(filePath);
    } catch (error) {
      console.log("File not found in uploads directory, continuing with deletion");
    }
    
    // Remove document from knowledge base
    existingDocs.splice(documentIndex, 1);
    
    // Save updated knowledge base
    await writeFile(KNOWLEDGE_BASE_FILE, JSON.stringify(existingDocs, null, 2));
    
    console.log(`🗑️ Document deleted: ${document.title}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Document deleted successfully"
    });
    
  } catch (error) {
    console.error('Failed to delete document:', error);
    return NextResponse.json({ 
      error: "Failed to delete document", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
