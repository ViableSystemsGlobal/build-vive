import { NextRequest, NextResponse } from 'next/server';
import { readFile } from "fs/promises";
import { join } from "path";

interface VapiCallRequest {
  userPhone: string;
  userName?: string;
  userEmail?: string;
  quoteId?: string;
  context?: {
    projectType?: string;
    services?: string[];
    urgency?: string;
    location?: string;
    size?: string;
    timeline?: string;
    budget?: string;
    comments?: string;
    reason?: string;
    userMessage?: string;
  };
}

interface VapiCallResponse {
  success: boolean;
  message: string;
  callId?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<VapiCallResponse>> {
  try {
    const body: VapiCallRequest = await request.json();
    const { userPhone, userName, userEmail, quoteId, context } = body;
    
    if (!userPhone) {
      return NextResponse.json({
        success: false,
        message: "Phone number is required"
      }, { status: 400 });
    }

    // Load admin configuration
    let adminConfig = null;
    try {
      const configPath = join(process.cwd(), "data", "homepage.json");
      const configData = await readFile(configPath, "utf-8");
      adminConfig = JSON.parse(configData);
    } catch (error) {
      console.log("Could not load admin configuration");
      return NextResponse.json({
        success: false,
        message: "VAPI configuration not found"
      }, { status: 500 });
    }

    if (!adminConfig?.vapiApiKey || !adminConfig?.vapiAssistantId) {
      return NextResponse.json({
        success: false,
        message: "VAPI not configured"
      }, { status: 500 });
    }

    // Load quote context if quoteId is provided
    let quoteContext = null;
    if (quoteId) {
      try {
        const quotesPath = join(process.cwd(), "data", "quotes.json");
        const quotesData = await readFile(quotesPath, "utf-8");
        const quotes = JSON.parse(quotesData);
        quoteContext = quotes.find((q: any) => q.id === quoteId);
      } catch (error) {
        console.log("Could not load quote context");
      }
    }

    // Prepare context data for VAPI
    const vapiContext = {
      customer: {
        name: userName || quoteContext?.name || 'Valued Customer',
        email: userEmail || quoteContext?.email,
        phone: userPhone
      },
      project: {
        type: context?.projectType || quoteContext?.projectType || 'construction project',
        services: context?.services || quoteContext?.services || [],
        urgency: context?.urgency || quoteContext?.urgency || 'non-emergency',
        location: context?.location || quoteContext?.location || 'Denver area',
        size: context?.size || quoteContext?.size,
        timeline: context?.timeline || quoteContext?.timeline,
        budget: context?.budget || quoteContext?.budget,
        comments: context?.comments || quoteContext?.comments
      },
      escalation: {
        reason: context?.reason || 'Customer requested assistance',
        userMessage: context?.userMessage || 'Customer needs help with their project'
      },
      company: {
        name: adminConfig.companyName || 'BuildVive Renovations',
        phone: adminConfig.footerPhone || '(555) 123-4567',
        email: adminConfig.footerEmail || 'info@buildvive.com',
        address: adminConfig.footerAddress || 'Denver, Colorado'
      }
    };

    // Create VAPI call with context
    const vapiCallData = {
      phoneNumberId: adminConfig.vapiPhoneNumberId, // You'll need to add this to admin config
      assistantId: adminConfig.vapiAssistantId,
      customer: {
        number: userPhone,
        name: vapiContext.customer.name
      },
      // Send context as metadata that VAPI can access
      metadata: {
        context: JSON.stringify(vapiContext),
        quoteId: quoteId,
        escalationId: `ESC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      }
    };

    console.log('🚀 Triggering VAPI call with context:', {
      phone: userPhone,
      context: vapiContext,
      callData: vapiCallData
    });

    // Make the actual VAPI API call
    const vapiResponse = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminConfig.vapiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vapiCallData)
    });

    if (!vapiResponse.ok) {
      const errorData = await vapiResponse.json();
      console.error('VAPI API error:', errorData);
      return NextResponse.json({
        success: false,
        message: `Failed to initiate call: ${errorData.message || 'Unknown error'}`
      }, { status: 500 });
    }

    const vapiResult = await vapiResponse.json();
    console.log('✅ VAPI call initiated successfully:', vapiResult);

    return NextResponse.json({
      success: true,
      message: "Call initiated successfully. Our team will contact you shortly.",
      callId: vapiResult.id
    });

  } catch (error) {
    console.error('VAPI call API error:', error);
    return NextResponse.json({
      success: false,
      message: "Failed to initiate call. Please try again or call us directly."
    }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: "VAPI Call API is running. Use POST to initiate calls with context.",
    endpoints: {
      POST: "Initiate VAPI call with customer context"
    },
    example: {
      userPhone: "+1234567890",
      userName: "John Doe",
      quoteId: "1234567890",
      context: {
        projectType: "Kitchen Remodeling",
        urgency: "Emergency",
        reason: "Customer needs immediate assistance"
      }
    }
  });
}
