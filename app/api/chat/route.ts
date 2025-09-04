import { NextRequest, NextResponse } from 'next/server';
import { readFile } from "fs/promises";
import { join } from "path";

interface ChatRequest {
  message: string;
  quoteId?: string; // Optional quote ID for context
  userId?: string; // Optional user identifier
}

interface ChatResponse {
  response: string;
  escalate?: boolean;
}

// Emergency keywords and responses
const emergencyKeywords = {
  "plumbing leak": [
    "🚨 EMERGENCY: Plumbing leak detected!",
    "1. Shut off your main water valve immediately",
    "2. Close all nearby taps and drains", 
    "3. Place buckets under active leaks",
    "4. Turn off electrical appliances in affected areas",
    "Would you like us to call you right now for immediate assistance?"
  ],
  "electrical issue": [
    "⚡ EMERGENCY: Electrical issue detected!",
    "1. Turn off power at the main breaker",
    "2. Do NOT touch any electrical equipment",
    "3. Keep everyone away from affected areas",
    "4. Check for any burning smells or smoke",
    "Would you like us to call you right now for immediate assistance?"
  ],
  "structural damage": [
    "🏗️ EMERGENCY: Structural damage detected!",
    "1. Evacuate the area immediately",
    "2. Do NOT enter damaged rooms",
    "3. Call emergency services if severe",
    "4. Document damage with photos",
    "Would you like us to call you right now for immediate assistance?"
  ],
  "gas leak": [
    "⚠️ EMERGENCY: Gas leak detected!",
    "1. Evacuate immediately - do NOT use electronics",
    "2. Call gas company emergency line",
    "3. Do NOT light matches or use lighters",
    "4. Open windows if safe to do so",
    "Would you like us to call you right now for immediate assistance?"
  ]
};

// General advice keywords and responses
const generalAdvice = {
  "renovation planning": [
    "🏠 Renovation Planning Tips:",
    "1. Set a realistic budget (add 20% buffer)",
    "2. Research local permits and regulations",
    "3. Plan for temporary living arrangements if needed",
    "4. Choose materials that match your climate",
    "5. Consider energy efficiency upgrades"
  ],
  "maintenance": [
    "🔧 Regular Maintenance Tips:",
    "1. Inspect roof twice yearly",
    "2. Clean gutters every 3-6 months",
    "3. Check HVAC filters monthly",
    "4. Test smoke detectors quarterly",
    "5. Schedule annual professional inspection"
  ],
  "permits": [
    "📋 Permit Information:",
    "1. Most structural changes require permits",
    "2. Electrical and plumbing work needs permits",
    "3. Cosmetic changes usually don't need permits",
    "4. Permit costs vary by project scope",
    "5. Processing time: 2-6 weeks typically"
  ],
  "budget": [
    "💰 Budget Planning:",
    "1. Get multiple quotes from contractors",
    "2. Include 15-20% contingency for unexpected issues",
    "3. Consider long-term maintenance costs",
    "4. Factor in permit and inspection fees",
    "5. Plan for temporary accommodation if needed"
  ],
  "timeline": [
    "⏰ Project Timeline:",
    "1. Small projects: 1-4 weeks",
    "2. Medium renovations: 4-12 weeks",
    "3. Large projects: 3-6 months",
    "4. Weather can affect outdoor work",
    "5. Permits may add 2-6 weeks to timeline"
  ]
};

// Greeting and general responses
const generalResponses = [
  "Hello! I'm here to help with construction advice and emergency guidance. What can I assist you with today?",
  "Hi there! I can help with construction questions, emergency procedures, or general advice. What do you need?",
  "Welcome! I'm your construction support assistant. How can I help you today?",
  "Hello! I'm here to provide construction guidance and emergency support. What would you like to know?"
];

// Check if message contains emergency keywords
function detectEmergency(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const detectedEmergencies: string[] = [];
  
  for (const [keyword, _] of Object.entries(emergencyKeywords)) {
    if (lowerMessage.includes(keyword) || 
        (keyword === "plumbing leak" && (lowerMessage.includes('leak') || lowerMessage.includes('water') || lowerMessage.includes('flood'))) ||
        (keyword === "electrical issue" && (lowerMessage.includes('electrical') || lowerMessage.includes('spark') || lowerMessage.includes('power'))) ||
        (keyword === "structural damage" && (lowerMessage.includes('crack') || lowerMessage.includes('structural') || lowerMessage.includes('damage'))) ||
        (keyword === "gas leak" && (lowerMessage.includes('gas') || lowerMessage.includes('smell') || lowerMessage.includes('odor')))) {
      detectedEmergencies.push(keyword);
    }
  }
  
  return detectedEmergencies;
}

// Check if message contains general advice keywords
function detectGeneralAdvice(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const detectedTopics: string[] = [];
  
  for (const [keyword, _] of Object.entries(generalAdvice)) {
    if (lowerMessage.includes(keyword) || 
        (keyword === "renovation planning" && (lowerMessage.includes('renovation') || lowerMessage.includes('remodel') || lowerMessage.includes('planning'))) ||
        (keyword === "maintenance" && (lowerMessage.includes('maintenance') || lowerMessage.includes('inspect') || lowerMessage.includes('check'))) ||
        (keyword === "permits" && (lowerMessage.includes('permit') || lowerMessage.includes('legal') || lowerMessage.includes('regulation'))) ||
        (keyword === "budget" && (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price'))) ||
        (keyword === "timeline" && (lowerMessage.includes('timeline') || lowerMessage.includes('schedule') || lowerMessage.includes('duration')))) {
      detectedTopics.push(keyword);
    }
  }
  
  return detectedTopics;
}

// Check if user wants escalation
function wantsEscalation(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  // Only escalate for specific call requests, not general "yes" responses
  const escalationKeywords = ['call me', 'call me now', 'phone call', 'call you', 'call us', 'urgent help', 'emergency assistance'];
  
  return escalationKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Generate personalized greeting based on quote context
function generatePersonalizedGreeting(quoteContext: {
  name?: string;
  projectType?: string;
  services?: string[];
  urgency?: string;
  [key: string]: unknown;
}): string {
  const name = quoteContext.name || 'there';
  const projectType = quoteContext.projectType || 'construction project';
  const services = quoteContext.services || [];
  const urgency = quoteContext.urgency || '';
  
  let greeting = `Hi ${name}! 👋\n\n`;
  
  if (urgency.includes('Emergency')) {
    greeting += `🚨 I see you have an emergency ${projectType.toLowerCase()} that needs immediate attention. `;
    greeting += `Our team is working on your quote right now and will get back to you within 30 minutes.\n\n`;
    greeting += `While we process your request, I can provide immediate safety guidance and emergency procedures. `;
    greeting += `What specific type of emergency are you dealing with?`;
  } else {
    greeting += `I see you're planning a ${projectType.toLowerCase()} project. `;
    greeting += `Our team is working on your quote and will get back to you within 30 minutes.\n\n`;
    
    if (services.length > 0) {
      greeting += `I can see you're interested in: ${services.join(', ')}. `;
    }
    
    greeting += `I'm here to help with planning advice, permit information, timeline estimates, and general guidance while we prepare your quote. `;
    greeting += `What would you like to know more about?`;
  }
  
  return greeting;
}

// Get AI response from OpenAI
async function getAIResponse(message: string, adminConfig: {
  openaiApiKey: string;
  openaiModel?: string;
}, quoteContext?: {
  id: string;
  name?: string;
  projectType?: string;
  services?: string[];
  location?: string;
  size?: string;
  timeline?: string;
  budget?: string;
  urgency?: string;
  comments?: string;
  [key: string]: unknown;
}): Promise<string> {
  const openaiApiKey = adminConfig.openaiApiKey;
  const model = adminConfig.openaiModel || 'gpt-4o-mini';
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = `You are a helpful construction industry assistant for ACE Construction, a premier construction company in Denver. 

Your role is to provide:
- Professional construction advice and guidance
- Safety recommendations and best practices
- Project planning and budgeting tips
- Permit and regulation information
- General construction knowledge

IMPORTANT GUIDELINES:
- Always prioritize safety in your responses
- Be professional but friendly
- Provide practical, actionable advice
- If someone mentions an emergency (leak, electrical issue, structural damage, gas leak), immediately provide safety steps and offer to connect them with emergency support
- Keep responses concise but informative
- Use construction industry terminology appropriately
- If you're unsure about something, recommend consulting with a professional
- Use available context about the user's project to provide personalized advice

${quoteContext ? `USER PROJECT CONTEXT:
- Name: ${quoteContext.name || 'Not provided'}
- Project Type: ${quoteContext.projectType || 'Not specified'}
- Services Needed: ${quoteContext.services?.join(', ') || 'Not specified'}
- Location: ${quoteContext.location || 'Not specified'}
- Project Size: ${quoteContext.size || 'Not specified'}
- Timeline: ${quoteContext.timeline || 'Not specified'}
- Budget Range: ${quoteContext.budget || 'Not specified'}
- Urgency: ${quoteContext.urgency || 'Not specified'}
- Additional Comments: ${quoteContext.comments || 'None'}

Use this context to provide more relevant and personalized advice. Reference their specific project details when appropriate.` : ''}

Current user message: "${message}"

Please provide a helpful, professional response that addresses their construction-related question or concern.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I encountered an error processing your request.';
    
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw new Error('Failed to get AI response');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse>> {
  try {
    const body: ChatRequest = await request.json();
    const { message } = body;
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ 
        response: "I didn't receive a valid message. Please try again." 
      });
    }

    const lowerMessage = message.toLowerCase();
    
    // Load admin configuration to get OpenAI API key
    let adminConfig = null;
    let useAI = false;
    
    try {
      const configPath = join(process.cwd(), "data", "homepage.json");
      const configData = await readFile(configPath, "utf-8");
      adminConfig = JSON.parse(configData);
      useAI = !!(adminConfig?.openaiApiKey);
    } catch {
      console.log("Could not load admin configuration, using rule-based responses");
    }

    // Load quote context if quoteId is provided
    let quoteContext = null;
    if (body.quoteId) {
      try {
        const quotesPath = join(process.cwd(), "data", "quotes.json");
        const quotesData = await readFile(quotesPath, "utf-8");
        const quotes = JSON.parse(quotesData);
        quoteContext = quotes.find((q: any) => q.id === body.quoteId);
      } catch {
        console.log("Could not load quote context");
      }
    }
    
    // Handle special QUOTE_SUBMITTED message for personalized greeting
    if (message === 'QUOTE_SUBMITTED' && quoteContext) {
      const personalizedGreeting = generatePersonalizedGreeting(quoteContext);
      return NextResponse.json({ response: personalizedGreeting });
    }

    // Check for emergency situations first (always use rule-based for safety)
    const emergencies = detectEmergency(message);
    if (emergencies.length > 0) {
      const emergencyType = emergencies[0] as keyof typeof emergencyKeywords;
      const emergencyResponse = emergencyKeywords[emergencyType].join('\n');
      return NextResponse.json({
        response: emergencyResponse,
        escalate: wantsEscalation(message)
      });
    }
    
    // Check if user wants escalation (always use rule-based for safety)
    if (wantsEscalation(message)) {
      return NextResponse.json({
        response: "I understand you need immediate assistance. Let me connect you with our team right now.",
        escalate: true
      });
    }

    // Use AI if configured, otherwise fall back to rule-based
    if (useAI && adminConfig?.openaiApiKey) {
      try {
        const aiResponse = await getAIResponse(message, adminConfig, quoteContext);
        return NextResponse.json({
          response: aiResponse,
          escalate: false
        });
      } catch {
        console.error('AI response failed, falling back to rule-based');
        // Fall through to rule-based responses
      }
    }
    
    // Fallback to rule-based responses
    const adviceTopics = detectGeneralAdvice(message);
    if (adviceTopics.length > 0) {
      const adviceType = adviceTopics[0] as keyof typeof generalAdvice;
      const adviceResponse = generalAdvice[adviceType].join('\n');
      return NextResponse.json({
        response: adviceResponse,
        escalate: false
      });
    }
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const randomGreeting = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      return NextResponse.json({
        response: randomGreeting,
        escalate: false
      });
    }
    
    // Check for thank you messages
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return NextResponse.json({
        response: "You're welcome! I'm here to help. Is there anything else you'd like to know about construction or need assistance with?",
        escalate: false
      });
    }
    
    // Default response for unrecognized messages
    return NextResponse.json({
      response: "I'm not sure I understand your question. Could you please rephrase it? I can help with:\n\n• Emergency situations (leaks, electrical issues, structural damage)\n• General construction advice (renovation, maintenance, permits)\n• Budget and timeline planning\n\nOr if you need immediate assistance, just say 'call me' and I'll connect you with our team.",
      escalate: false
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      response: "I'm experiencing technical difficulties. Please call us directly for immediate assistance at (555) 123-4567."
    }, { status: 500 });
  }
}
