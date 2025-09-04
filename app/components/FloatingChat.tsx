"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuote } from './QuoteProvider';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotConfig {
  greeting: string;
  emergencyGuidance: Record<string, string[]>;
  generalAdvice: Record<string, string[]>;
  escalationMessage: string;
  callConfirmation: string;
}

const defaultConfig: ChatbotConfig = {
  greeting: "Thanks for submitting your request! While we process your quote, can I help with some immediate advice?",
  emergencyGuidance: {
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
  },
  generalAdvice: {
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
    ]
  },
  escalationMessage: "We're calling you now! Please keep your phone nearby.",
  callConfirmation: "Great! We'll call you shortly. In the meantime, here are some immediate steps you can take:"
};

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { quoteSubmitted, setQuoteSubmitted, currentQuoteId } = useQuote();
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [chatStartTime] = useState(() => new Date().toISOString());

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = useCallback((content: string) => {
    addMessage(content, 'bot');
  }, []);

  // Auto-open chat when quote is submitted
  useEffect(() => {
    const handleQuoteSubmitted = () => {
      console.log('Custom event quoteSubmitted received');
      setIsOpen(true);
      addBotMessage(defaultConfig.greeting);
    };

    // Listen for custom event from QuoteModal
    window.addEventListener('quoteSubmitted', handleQuoteSubmitted);
    console.log('Added quoteSubmitted event listener');

    return () => {
      window.removeEventListener('quoteSubmitted', handleQuoteSubmitted);
    };
  }, [addBotMessage]);

  // Handle quote submitted from context
  useEffect(() => {
    console.log('Quote submitted effect triggered:', quoteSubmitted);
    if (quoteSubmitted) {
      console.log('Opening chat and adding personalized greeting');
      setIsOpen(true);
      
      // Send initial message to get personalized response
      if (currentQuoteId) {
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: 'QUOTE_SUBMITTED',
            quoteId: currentQuoteId,
            userId: sessionId
          })
        })
        .then(response => response.json())
        .then(data => {
          addBotMessage(data.response);
        })
        .catch(() => {
          addBotMessage(defaultConfig.greeting);
        });
      } else {
        addBotMessage(defaultConfig.greeting);
      }
      
      setQuoteSubmitted(false);
    }
  }, [quoteSubmitted, setQuoteSubmitted, currentQuoteId, sessionId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, 'user');
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          quoteId: currentQuoteId,
          userId: sessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        addBotMessage(data.response);
        
        // Check if escalation is needed
        if (data.escalate) {
          setTimeout(() => {
            handleEscalation();
          }, 1000);
        }
      } else {
        addBotMessage("I'm having trouble processing your request. Let me connect you with our team.");
      }
    } catch (error) {
      addBotMessage("I'm experiencing technical difficulties. Please call us directly for immediate assistance.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleEscalation = async () => {
    try {
      const response = await fetch('/api/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reason: 'Chatbot escalation',
          userMessage: messages[messages.length - 1]?.content || ''
        })
      });

      if (response.ok) {
        addBotMessage(defaultConfig.escalationMessage);
      } else {
        addBotMessage("I'm having trouble connecting you. Please call us directly at (555) 123-4567.");
      }
    } catch (error) {
      addBotMessage("Connection failed. Please call us directly for immediate assistance.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Save chat history when chat closes
  const saveChatHistory = async () => {
    if (messages.length === 0) return;

    try {
      const chatData = {
        sessionId,
        startTime: chatStartTime,
        endTime: new Date().toISOString(),
        messages: messages.map(msg => ({
          id: msg.id,
          type: msg.type,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        })),
        status: 'completed' as const,
        tags: generateTags(messages),
        escalationReason: messages.some(msg => msg.content.toLowerCase().includes('call')) ? 'User requested call' : undefined
      };

      // Save to admin data (this will be handled by the admin API)
      await fetch('/api/admin/chat-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatData)
      });
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  // Generate tags based on chat content
  const generateTags = (msgs: Message[]): string[] => {
    const tags: string[] = [];
    const content = msgs.map(m => m.content.toLowerCase()).join(' ');
    
    if (content.includes('emergency') || content.includes('urgent')) tags.push('emergency');
    if (content.includes('plumbing') || content.includes('leak') || content.includes('water')) tags.push('plumbing');
    if (content.includes('electrical') || content.includes('power') || content.includes('spark')) tags.push('electrical');
    if (content.includes('structural') || content.includes('damage') || content.includes('crack')) tags.push('structural');
    if (content.includes('renovation') || content.includes('remodel')) tags.push('renovation');
    if (content.includes('maintenance') || content.includes('inspect')) tags.push('maintenance');
    if (content.includes('permit') || content.includes('regulation')) tags.push('permits');
    if (content.includes('budget') || content.includes('cost')) tags.push('budget');
    if (content.includes('timeline') || content.includes('schedule')) tags.push('timeline');
    
    return tags;
  };

  const getEmergencyKeywords = (message: string): string[] => {
    const lowerMessage = message.toLowerCase();
    const keywords = [];
    
    if (lowerMessage.includes('leak') || lowerMessage.includes('water') || lowerMessage.includes('flood')) {
      keywords.push('plumbing leak');
    }
    if (lowerMessage.includes('electrical') || lowerMessage.includes('spark') || lowerMessage.includes('power')) {
      keywords.push('electrical issue');
    }
    if (lowerMessage.includes('crack') || lowerMessage.includes('structural') || lowerMessage.includes('damage')) {
      keywords.push('structural damage');
    }
    if (lowerMessage.includes('gas') || lowerMessage.includes('smell') || lowerMessage.includes('odor')) {
      keywords.push('gas leak');
    }
    
    return keywords;
  };

  const getGeneralKeywords = (message: string): string[] => {
    const lowerMessage = message.toLowerCase();
    const keywords = [];
    
    if (lowerMessage.includes('renovation') || lowerMessage.includes('remodel') || lowerMessage.includes('planning')) {
      keywords.push('renovation planning');
    }
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('inspect') || lowerMessage.includes('check')) {
      keywords.push('maintenance');
    }
    if (lowerMessage.includes('permit') || lowerMessage.includes('legal') || lowerMessage.includes('regulation')) {
      keywords.push('permits');
    }
    
    return keywords;
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => {
          if (isOpen) {
            // Save chat history when closing
            saveChatHistory();
          }
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="bg-primary text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Support Assistant</h3>
                  <p className="text-xs opacity-90">Construction & Emergency Guidance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <div className="whitespace-pre-line">{message.content}</div>
                  <div className={`text-xs mt-1 opacity-70 ${
                    message.type === 'user' ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
