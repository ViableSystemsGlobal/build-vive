import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

interface VapiWebhookData {
  type: string;
  call: {
    id: string;
    status: string;
    customer: {
      number: string;
      name?: string;
    };
    metadata?: {
      context?: string | object;
      quoteId?: string;
      escalationId?: string;
    };
    transcript?: string;
    recordingUrl?: string;
    duration?: number;
    cost?: number;
    summary?: string;
    analysis?: {
      sentiment?: string;
      topics?: string[];
      actionItems?: string[];
    };
  };
  transcript?: {
    id: string;
    role: 'user' | 'assistant';
    message: string;
    timestamp: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const webhookData: VapiWebhookData = await request.json();
    
    console.log('📞 VAPI Webhook received:', {
      type: webhookData.type,
      callId: webhookData.call.id,
      status: webhookData.call.status,
      customer: webhookData.call.customer
    });

    // Handle different webhook types
    switch (webhookData.type) {
      case 'status-update':
        console.log('📞 Status update:', {
          callId: webhookData.call.id,
          status: webhookData.call.status,
          customer: webhookData.call.customer
        });
        
        if (webhookData.call.status === 'started') {
          console.log('📞 Call started:', webhookData.call.id);
          await initializeCallSession(webhookData);
        } else if (webhookData.call.status === 'ended') {
          console.log('📞 Call ended:', {
            callId: webhookData.call.id,
            duration: webhookData.call.duration,
            cost: webhookData.call.cost,
            status: webhookData.call.status
          });
          await finalizeCallSession(webhookData);
        }
        break;
        
      case 'transcript':
        console.log('📝 Live transcript chunk received:', {
          callId: webhookData.call.id,
          role: webhookData.transcript?.role,
          message: webhookData.transcript?.message?.substring(0, 100) + '...'
        });
        await appendTranscriptChunk(webhookData);
        break;
        
      case 'end-of-call-report':
        console.log('📋 End of call report received:', {
          callId: webhookData.call.id,
          summary: webhookData.call.summary?.substring(0, 100) + '...',
          analysis: webhookData.call.analysis
        });
        await saveCallReport(webhookData);
        break;
        
      default:
        console.log('⚠️ Unhandled webhook event type:', webhookData.type, {
          callId: webhookData.call?.id,
          timestamp: new Date().toISOString()
        });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('VAPI webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Safely parse metadata context
function parseMetadataContext(metadata: any): object {
  if (!metadata?.context) return {};
  
  try {
    if (typeof metadata.context === 'string') {
      return JSON.parse(metadata.context);
    } else if (typeof metadata.context === 'object') {
      return metadata.context;
    }
  } catch (error) {
    console.warn('⚠️ Failed to parse metadata context:', error);
  }
  
  return {};
}

// Initialize call session when call starts
async function initializeCallSession(webhookData: VapiWebhookData) {
  try {
    const dataDir = join(process.cwd(), 'data');
    const chatHistoryFile = join(dataDir, 'chat-history.json');
    
    // Ensure data directory exists
    await mkdir(dataDir, { recursive: true });
    
    // Read existing chat history
    let chatHistory = [];
    try {
      const existingData = await readFile(chatHistoryFile, 'utf-8');
      chatHistory = JSON.parse(existingData);
    } catch {
      // File doesn't exist, start with empty array
    }
    
    // Parse context from metadata safely
    const context = parseMetadataContext(webhookData.call.metadata);
    
    // Create initial chat session record
    const chatSession = {
      id: `vapi_${webhookData.call.id}`,
      sessionId: webhookData.call.id,
      userId: webhookData.call.customer.number,
      userPhone: webhookData.call.customer.number,
      userName: webhookData.call.customer.name || (context as any).customer?.name,
      messages: [
        {
          id: 'vapi_call_start',
          type: 'bot',
          content: 'Phone call initiated via VAPI',
          timestamp: new Date().toISOString()
        }
      ],
      startTime: new Date().toISOString(),
      endTime: null, // Will be set when call ends
      status: 'active',
      escalationReason: 'VAPI phone call',
      tags: ['vapi', 'phone-call'],
      metadata: {
        callId: webhookData.call.id,
        duration: null,
        cost: null,
        recordingUrl: null,
        transcript: '',
        context: context
      }
    };
    
    // Add to chat history
    chatHistory.push(chatSession);
    
    // Save updated chat history
    await writeFile(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
    
    console.log('✅ VAPI call session initialized:', webhookData.call.id);
    
  } catch (error) {
    console.error('Failed to initialize VAPI call session:', error);
  }
}

// Append transcript chunks progressively
async function appendTranscriptChunk(webhookData: VapiWebhookData) {
  try {
    const dataDir = join(process.cwd(), 'data');
    const chatHistoryFile = join(dataDir, 'chat-history.json');
    
    // Read existing chat history
    let chatHistory = [];
    try {
      const existingData = await readFile(chatHistoryFile, 'utf-8');
      chatHistory = JSON.parse(existingData);
    } catch {
      console.error('Could not read chat history file');
      return;
    }
    
    // Find the call session
    const sessionIndex = chatHistory.findIndex((session: any) => 
      session.id === `vapi_${webhookData.call.id}`
    );
    
    if (sessionIndex === -1) {
      console.warn('⚠️ Call session not found for transcript:', webhookData.call.id);
      return;
    }
    
    // Add transcript chunk as a message
    if (webhookData.transcript) {
      const transcriptMessage = {
        id: `transcript_${webhookData.transcript.id}`,
        type: webhookData.transcript.role === 'user' ? 'user' : 'bot',
        content: webhookData.transcript.message,
        timestamp: webhookData.transcript.timestamp
      };
      
      chatHistory[sessionIndex].messages.push(transcriptMessage);
      
      // Update transcript in metadata
      chatHistory[sessionIndex].metadata.transcript += 
        `${webhookData.transcript.role}: ${webhookData.transcript.message}\n`;
    }
    
    // Save updated chat history
    await writeFile(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
    
    console.log('✅ Transcript chunk appended:', webhookData.call.id);
    
  } catch (error) {
    console.error('Failed to append transcript chunk:', error);
  }
}

// Finalize call session when call ends
async function finalizeCallSession(webhookData: VapiWebhookData) {
  try {
    const dataDir = join(process.cwd(), 'data');
    const chatHistoryFile = join(dataDir, 'chat-history.json');
    
    // Read existing chat history
    let chatHistory = [];
    try {
      const existingData = await readFile(chatHistoryFile, 'utf-8');
      chatHistory = JSON.parse(existingData);
    } catch {
      console.error('Could not read chat history file');
      return;
    }
    
    // Find the call session
    const sessionIndex = chatHistory.findIndex((session: any) => 
      session.id === `vapi_${webhookData.call.id}`
    );
    
    if (sessionIndex === -1) {
      console.warn('⚠️ Call session not found for finalization:', webhookData.call.id);
      return;
    }
    
    // Update session with final data
    chatHistory[sessionIndex].endTime = new Date().toISOString();
    chatHistory[sessionIndex].status = 'completed';
    chatHistory[sessionIndex].metadata.duration = webhookData.call.duration;
    chatHistory[sessionIndex].metadata.cost = webhookData.call.cost;
    chatHistory[sessionIndex].metadata.recordingUrl = webhookData.call.recordingUrl;
    
    // Add call end message
    chatHistory[sessionIndex].messages.push({
      id: 'vapi_call_end',
      type: 'bot',
      content: 'Phone call completed',
      timestamp: new Date().toISOString()
    });
    
    // Save updated chat history
    await writeFile(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
    
    console.log('✅ VAPI call session finalized:', webhookData.call.id);
    
  } catch (error) {
    console.error('Failed to finalize VAPI call session:', error);
  }
}

// Save end-of-call report
async function saveCallReport(webhookData: VapiWebhookData) {
  try {
    const dataDir = join(process.cwd(), 'data');
    const chatHistoryFile = join(dataDir, 'chat-history.json');
    
    // Read existing chat history
    let chatHistory = [];
    try {
      const existingData = await readFile(chatHistoryFile, 'utf-8');
      chatHistory = JSON.parse(existingData);
    } catch {
      console.error('Could not read chat history file');
      return;
    }
    
    // Find the call session
    const sessionIndex = chatHistory.findIndex((session: any) => 
      session.id === `vapi_${webhookData.call.id}`
    );
    
    if (sessionIndex === -1) {
      console.warn('⚠️ Call session not found for report:', webhookData.call.id);
      return;
    }
    
    // Update session with report data
    chatHistory[sessionIndex].metadata.summary = webhookData.call.summary;
    chatHistory[sessionIndex].metadata.analysis = webhookData.call.analysis;
    chatHistory[sessionIndex].metadata.finalTranscript = webhookData.call.transcript;
    
    // Save updated chat history
    await writeFile(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
    
    console.log('✅ VAPI call report saved:', webhookData.call.id);
    
  } catch (error) {
    console.error('Failed to save VAPI call report:', error);
  }
}

// GET endpoint for testing
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: "VAPI Webhook endpoint is running",
    supportedEvents: ['status-update', 'transcript', 'end-of-call-report'],
    eventTypes: {
      'status-update': 'Handles call started/ended status changes',
      'transcript': 'Live transcript chunks during the call',
      'end-of-call-report': 'Final transcript, summary, and analysis'
    },
    examples: {
      'status-update': {
        type: 'status-update',
        call: {
          id: 'call_123',
          status: 'started', // or 'ended'
          customer: { number: '+1234567890', name: 'John Doe' },
          metadata: {
            context: '{"customer":{"name":"John Doe","projectType":"Kitchen Remodeling"}}'
          }
        }
      },
      'transcript': {
        type: 'transcript',
        call: { id: 'call_123' },
        transcript: {
          id: 'transcript_456',
          role: 'user',
          message: 'I need help with my kitchen renovation',
          timestamp: '2024-01-15T10:30:00Z'
        }
      },
      'end-of-call-report': {
        type: 'end-of-call-report',
        call: {
          id: 'call_123',
          summary: 'Customer discussed kitchen renovation timeline and budget',
          analysis: {
            sentiment: 'positive',
            topics: ['kitchen', 'renovation', 'timeline'],
            actionItems: ['Send quote', 'Schedule consultation']
          }
        }
      }
    }
  });
}
