import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const CHAT_HISTORY_FILE = join(DATA_DIR, "chat-history.json");

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  sessionId: string;
  userId?: string;
  userPhone?: string;
  userName?: string;
  messages: ChatMessage[];
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'escalated';
  escalationReason?: string;
  tags: string[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const chatData: ChatSession = await request.json();
    
    // Generate unique ID if not provided
    if (!chatData.id) {
      chatData.id = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Create data directory if it doesn't exist
    try {
      await mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
      console.log("Data directory already exists");
    }
    
    // Read existing chat history
    let existingHistory: ChatSession[] = [];
    try {
      const existingData = await readFile(CHAT_HISTORY_FILE, "utf-8");
      existingHistory = JSON.parse(existingData);
    } catch (error) {
      console.log("No existing chat history file, starting fresh");
    }
    
    // Add new chat session
    existingHistory.push(chatData);
    
    // Save updated history
    await writeFile(CHAT_HISTORY_FILE, JSON.stringify(existingHistory, null, 2));
    
    console.log(`💬 Chat history saved: ${chatData.sessionId}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Chat history saved successfully",
      chatId: chatData.id
    });
    
  } catch (error) {
    console.error('Failed to save chat history:', error);
    return NextResponse.json({ 
      error: "Failed to save chat history", 
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
    
    // Read existing chat history
    let existingHistory: ChatSession[] = [];
    try {
      const existingData = await readFile(CHAT_HISTORY_FILE, "utf-8");
      existingHistory = JSON.parse(existingData);
    } catch (error) {
      console.log("No existing chat history file found");
    }
    
    return NextResponse.json({
      success: true,
      chatHistory: existingHistory,
      total: existingHistory.length
    });
    
  } catch (error) {
    console.error('Failed to read chat history:', error);
    return NextResponse.json({ 
      error: "Failed to read chat history", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
