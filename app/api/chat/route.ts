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
        (keyword === "timeline" && (lowerMessage.includes('timeline') || lowerMessage.includes('schedule') || lowerMessage.includes('duration') || lowerMessage.includes('how long') || lowerMessage.includes('take') || lowerMessage.includes('time')))) {
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
  location?: string;
  size?: string;
  timeline?: string;
  budget?: string;
  comments?: string;
  [key: string]: unknown;
}): string {
  const name = quoteContext.name || 'there';
  const projectType = quoteContext.projectType || 'construction project';
  const services = quoteContext.services || [];
  const urgency = quoteContext.urgency || '';
  const location = quoteContext.location || '';
  const size = quoteContext.size || '';
  const timeline = quoteContext.timeline || '';
  const budget = quoteContext.budget || '';
  const comments = quoteContext.comments || '';
  
  let greeting = `Hi ${name}! 👋\n\n`;
  
  if (urgency.includes('Emergency')) {
    greeting += `🚨 I see you have an emergency ${projectType.toLowerCase()} that needs immediate attention. `;
    greeting += `Our team is working on your quote right now and will get back to you within 30 minutes.\n\n`;
    greeting += `While we process your request, I can provide immediate safety guidance and emergency procedures. `;
    greeting += `What specific type of emergency are you dealing with?`;
  } else {
    // Create personalized message based on project details
    let personalizedMessage = `I see you're planning a ${projectType.toLowerCase()} project`;
    
    if (location) {
      personalizedMessage += ` in ${location}`;
    }
    
    if (size) {
      personalizedMessage += ` (${size})`;
    }
    
    personalizedMessage += `. `;
    
    // Add interesting random facts based on project type
    const projectFacts = {
      'kitchen': 'Did you know that kitchen remodels typically increase home value by 60-80%?',
      'bathroom': 'Bathroom renovations often have the highest ROI of any home improvement project!',
      'roofing': 'A new roof can improve your home\'s energy efficiency by up to 30%.',
      'flooring': 'Hardwood floors can last 100+ years with proper maintenance.',
      'electrical': 'Modern electrical upgrades can reduce energy costs by 20-30%.',
      'plumbing': 'New plumbing fixtures can reduce water usage by up to 50%.',
      'hvac': 'A new HVAC system can improve indoor air quality and reduce allergens.',
      'windows': 'Energy-efficient windows can save you $200-400 annually on heating/cooling.',
      'painting': 'A fresh coat of paint can increase your home\'s value by 1-3%.',
      'basement': 'Finished basements can add 70-75% of their cost to your home\'s value.'
    };
    
    // Find relevant fact based on project type or services
    let relevantFact = '';
    const lowerProjectType = projectType.toLowerCase();
    const lowerServices = services.map(s => s.toLowerCase()).join(' ');
    
    for (const [key, fact] of Object.entries(projectFacts)) {
      if (lowerProjectType.includes(key) || lowerServices.includes(key)) {
        relevantFact = fact;
        break;
      }
    }
    
    if (!relevantFact) {
      // Default facts for general construction
      const generalFacts = [
        'Construction projects in Denver often benefit from our 300+ days of sunshine for planning!',
        'Did you know that proper permits can actually save you money in the long run?',
        'Denver\'s building codes are designed to ensure your project lasts for decades.',
        'Many construction materials perform better in Colorado\'s climate than elsewhere.',
        'Planning your project during Denver\'s mild seasons can save 10-15% on costs.'
      ];
      relevantFact = generalFacts[Math.floor(Math.random() * generalFacts.length)];
    }
    
    greeting += personalizedMessage + relevantFact + '\n\n';
    
    greeting += `Our team is working on your quote and will get back to you within 30 minutes.\n\n`;
    
    if (services.length > 0) {
      greeting += `I can see you're interested in: ${services.join(', ')}. `;
    }
    
    // Add specific help based on project details
    let specificHelp = '';
    if (timeline && timeline.includes('urgent') || timeline.includes('asap')) {
      specificHelp = 'Since you need this done quickly, I can help you understand what can be expedited and what might need more time. ';
    } else if (budget && budget.includes('tight') || budget.includes('limited')) {
      specificHelp = 'I can help you prioritize which parts of your project will give you the best value for your budget. ';
    } else if (comments && comments.length > 50) {
      specificHelp = 'I see you\'ve provided detailed information about your project. I can help clarify any questions about permits, materials, or process. ';
    } else {
      specificHelp = 'I\'m here to help with planning advice, permit information, timeline estimates, and general guidance. ';
    }
    
    greeting += specificHelp + 'What would you like to know more about?';
  }
  
  return greeting;
}

// Generate contextual timeline response based on quote data
function generateContextualTimeline(quoteContext: {
  name?: string;
  projectType?: string;
  services?: string[];
  urgency?: string;
  location?: string;
  size?: string;
  timeline?: string;
  budget?: string;
  comments?: string;
  [key: string]: unknown;
}): string {
  const name = quoteContext.name || 'there';
  const projectType = quoteContext.projectType || 'project';
  const size = quoteContext.size || '';
  const urgency = quoteContext.urgency || '';
  const services = quoteContext.services || [];
  
  let response = `⏰ Timeline for your ${projectType.toLowerCase()}, ${name}:\n\n`;
  
  // Determine timeline based on project size and type
  let estimatedWeeks = '';
  if (size.includes('Small') || size.includes('<1,000')) {
    estimatedWeeks = '1-4 weeks';
  } else if (size.includes('Medium') || size.includes('1,000-2,500')) {
    estimatedWeeks = '4-12 weeks';
  } else if (size.includes('Large') || size.includes('>2,500')) {
    estimatedWeeks = '3-6 months';
  } else {
    estimatedWeeks = '2-8 weeks'; // Default estimate
  }
  
  response += `📅 **Estimated Duration: ${estimatedWeeks}**\n\n`;
  
  // Add urgency considerations
  if (urgency.includes('Emergency')) {
    response += `🚨 **Emergency Priority**: We can expedite your project and start within 24-48 hours for emergency situations.\n\n`;
  } else if (urgency.includes('ASAP') || urgency.includes('urgent')) {
    response += `⚡ **Urgent Timeline**: We can prioritize your project and potentially start within 1-2 weeks.\n\n`;
  }
  
  // Add project-specific timeline factors
  if (services.includes('Kitchen Remodeling')) {
    response += `🍳 **Kitchen Remodeling**: Typically takes 4-8 weeks including:\n`;
    response += `• Demolition: 1-2 days\n`;
    response += `• Plumbing/Electrical: 3-5 days\n`;
    response += `• Cabinetry installation: 3-5 days\n`;
    response += `• Countertops: 1-2 weeks (custom fabrication)\n`;
    response += `• Finishing touches: 3-5 days\n\n`;
  } else if (services.includes('Bathroom Remodeling')) {
    response += `🚿 **Bathroom Remodeling**: Usually takes 2-4 weeks including:\n`;
    response += `• Demolition: 1 day\n`;
    response += `• Plumbing/Electrical: 2-3 days\n`;
    response += `• Tile work: 3-5 days\n`;
    response += `• Fixture installation: 1-2 days\n`;
    response += `• Final touches: 1-2 days\n\n`;
  }
  
  // Add general timeline factors
  response += `📋 **Timeline Factors**:\n`;
  response += `• Permits: 2-6 weeks (varies by location)\n`;
  response += `• Material delivery: 1-3 weeks\n`;
  response += `• Weather delays: Possible for exterior work\n`;
  response += `• Change orders: May extend timeline\n\n`;
  
  response += `Our team will provide a detailed project schedule once we review your specific requirements. Would you like to discuss any specific timeline concerns?`;
  
  return response;
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
      
      // Special handling for timeline questions with quote context
      if (adviceType === "timeline" && quoteContext) {
        const contextualTimeline = generateContextualTimeline(quoteContext);
        return NextResponse.json({
          response: contextualTimeline,
          escalate: false
        });
      }
      
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
    
    // Check for generic affirmative responses
    if (lowerMessage === 'yes' || lowerMessage === 'yeah' || lowerMessage === 'sure' || lowerMessage === 'ok' || lowerMessage === 'okay') {
      if (quoteContext) {
        // Provide contextual help based on their project
        const projectType = quoteContext.projectType || 'project';
        const services = quoteContext.services || [];
        
        let contextualResponse = `Great! I'd be happy to help you with your ${projectType.toLowerCase()}. `;
        
        if (services.includes('Kitchen Remodeling')) {
          contextualResponse += `For kitchen remodeling, I can help with:\n\n• **Planning & Design**: Layout optimization, material selection, color schemes\n• **Timeline**: Project phases, permit requirements, scheduling\n• **Budget**: Cost breakdown, value engineering, financing options\n• **Permits**: Denver building codes, inspection process\n• **Materials**: Countertops, cabinets, flooring, appliances\n\nWhat specific aspect would you like to discuss?`;
        } else if (services.includes('Bathroom Remodeling')) {
          contextualResponse += `For bathroom remodeling, I can help with:\n\n• **Design**: Layout planning, fixture selection, storage solutions\n• **Timeline**: Project duration, phases, scheduling\n• **Budget**: Cost estimates, material options, value considerations\n• **Permits**: Plumbing permits, electrical requirements\n• **Materials**: Tiles, fixtures, vanities, lighting\n\nWhat would you like to know more about?`;
        } else {
          contextualResponse += `I can help you with:\n\n• **Project Planning**: Timeline, permits, design considerations\n• **Budget & Costs**: Estimates, financing, value engineering\n• **Materials & Options**: Product selection, quality considerations\n• **Denver-Specific**: Local codes, weather considerations, contractors\n• **Emergency Situations**: Immediate safety, urgent repairs\n\nWhat specific area would you like to explore?`;
        }
        
        return NextResponse.json({
          response: contextualResponse,
          escalate: false
        });
      } else {
        return NextResponse.json({
          response: "Great! I'm here to help with construction advice and guidance. What would you like to know about?\n\n• **Project Planning**: Timeline, permits, design\n• **Budget & Costs**: Estimates, financing options\n• **Materials**: Selection, quality, durability\n• **Emergency Situations**: Safety, urgent repairs\n• **Denver-Specific**: Local codes, weather considerations\n\nWhat can I help you with today?",
          escalate: false
        });
      }
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
