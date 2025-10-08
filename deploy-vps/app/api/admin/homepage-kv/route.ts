import { NextRequest, NextResponse } from "next/server";
import { kv } from '@vercel/kv';

// Default data
const defaultData = {
  // Navbar Section
  logoUrl: "",
  companyName: "Ace Construction",
  
  // Footer Section
  footerLogoUrl: "",
  footerCompanyName: "Ace Construction",
  footerDescription: "Building excellence in Denver since 2010. Your trusted partner for residential and commercial construction projects.",
  footerAddress: "123 Construction Way, Denver, CO 80202",
  footerPhone: "(555) 123-4567",
  footerEmail: "info@aceconstruction.com",
  
  // Favicon
  faviconUrl: "",
  
  badge: "#1 CONSTRUCTION COMPANY IN DENVER",
  headline: "Unparalleled construction solutions in Denver",
  subtext: "Experience excellence and durability with Ace Construction's Denver team of experts, offering innovative and unmatched residential and commercial solutions tailored to your needs.",
  heroImage: "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop",
  trustedUsers: "Trusted by 1 Million users",
  
  // OpenAI Configuration (AI-powered chatbot)
  openaiApiKey: "",
  openaiModel: "gpt-4o-mini",
  
  // Email Configuration
  smtpHost: "",
  smtpPort: "587",
  smtpUsername: "",
  smtpPassword: "",
  adminEmails: "",
  fromEmail: "",
  
  services: [
    { id: "1", title: "Residential Construction", description: "Custom homes and renovations", icon: "🏠", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop" },
    { id: "2", title: "Commercial Projects", description: "Office buildings and retail spaces", icon: "🏢", image: "https://images.unsplash.com/photo-1577962917302-cd874c8f14d6?q=80&w=1400&auto=format&fit=crop" },
    { id: "3", title: "Renovations", description: "Complete home and office makeovers", icon: "🔨", image: "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop" },
  ],
  
  aboutTitle: "Building Excellence Since 2010",
  aboutDescription: "With over a decade of experience in Denver's construction industry, we've built our reputation on quality craftsmanship and customer satisfaction.",
  aboutImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop",
  
  stats: [
    { number: "500+", label: "Projects Completed" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Client Satisfaction" },
  ],
  
  projects: [
    {
      id: "1",
      title: "Modern Office Complex",
      description: "A state-of-the-art office building featuring sustainable design and modern amenities.",
      badge: "Commercial",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop",
      features: ["LEED Certified", "Solar Panels", "Smart Building Systems", "Green Roof"]
    },
    {
      id: "2", 
      title: "Luxury Residential Villa",
      description: "Custom-built luxury home with premium finishes and smart home technology.",
      badge: "Residential",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop",
      features: ["Smart Home", "Premium Finishes", "Energy Efficient", "Custom Design"]
    },
    {
      id: "3",
      title: "Historic Building Renovation", 
      description: "Careful restoration of a historic building while adding modern functionality.",
      badge: "Renovation",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400&auto=format&fit=crop",
      features: ["Historic Preservation", "Modern Amenities", "Structural Upgrades", "Period Details"]
    }
  ],
  
  articles: [
    {
      id: "1",
      title: "Sustainable Construction Techniques",
      excerpt: "Learn about eco-friendly building methods that reduce environmental impact.",
      imageUrl: "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop",
      content: "Full article content about sustainable construction...",
      author: "John Smith",
      publishDate: "2024-01-15",
      category: "Sustainability",
      featured: true,
      slug: "sustainable-construction-techniques"
    },
    {
      id: "2",
      title: "Denver Construction Trends 2024",
      excerpt: "Discover the latest trends shaping Denver's construction industry.",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop",
      content: "Full article content about Denver construction trends...",
      author: "Sarah Johnson",
      publishDate: "2024-01-10",
      category: "Industry News",
      featured: false,
      slug: "denver-construction-trends-2024"
    },
    {
      id: "3",
      title: "Kitchen Remodeling Best Practices",
      excerpt: "Expert tips for planning and executing a successful kitchen renovation.",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1400&auto=format&fit=crop",
      content: "Full article content about kitchen remodeling...",
      author: "Mike Davis",
      publishDate: "2024-01-05",
      category: "Renovation",
      featured: false,
      slug: "kitchen-remodeling-best-practices"
    }
  ],
  
  trustedLogos: [
    { id: "1", imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=200&auto=format&fit=crop", alt: "Partner 1" },
    { id: "2", imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=200&auto=format&fit=crop", alt: "Partner 2" },
    { id: "3", imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=200&auto=format&fit=crop", alt: "Partner 3" },
    { id: "4", imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=200&auto=format&fit=crop", alt: "Partner 4" },
    { id: "5", imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=200&auto=format&fit=crop", alt: "Partner 5" }
  ],
  
  // Chatbot Settings
  chatbotGreeting: "Hello! I'm here to help with your construction needs. How can I assist you today?",
  plumbingLeakResponse: "🚨 Emergency Plumbing Leak Response:\n1. Turn off main water supply immediately\n2. Locate the leak source\n3. Use buckets/containers to catch water\n4. Call emergency plumber: (555) 123-4567\n5. Document damage for insurance\n6. Move valuables away from water",
  electricalIssueResponse: "⚡ Electrical Emergency Response:\n1. Turn off power at main breaker\n2. Do NOT touch exposed wires\n3. Evacuate if you smell burning\n4. Call emergency electrician: (555) 123-4567\n5. Keep away from water near electrical issues\n6. Use flashlight, not candles",
  renovationPlanningResponse: "🏠 Renovation Planning Tips:\n1. Set a realistic budget (add 20% buffer)\n2. Research local permits and regulations\n3. Plan for temporary living arrangements if needed\n4. Choose materials that match your climate\n5. Consider energy efficiency upgrades",
  maintenanceTipsResponse: "🔧 Regular Maintenance Tips:\n1. Inspect roof twice yearly\n2. Clean gutters every 3-6 months\n3. Check HVAC filters monthly\n4. Test smoke detectors quarterly\n5. Schedule annual professional inspection",
  escalationMessage: "We're calling you now! Please keep your phone nearby.",
  emergencyPhone: "(555) 123-4567",
  
  // API Keys
  twilioApiKey: "",
  twilioAuthToken: "",
  twilioPhoneNumber: "",
  vapiApiKey: "",
  vapiAssistantId: "",
  
  // Knowledge Base
  knowledgeBase: []
};

export async function GET() {
  try {
    // Check if KV is available
    if (!process.env.KV_REST_API_URL) {
      // Fallback to default data if KV is not configured
      return NextResponse.json(defaultData);
    }

    const data = await kv.get('homepage-data');
    
    if (!data) {
      // Initialize with default data
      await kv.set('homepage-data', JSON.stringify(defaultData));
      return NextResponse.json(defaultData);
    }
    
    return NextResponse.json(JSON.parse(data as string));
  } catch (error) {
    console.error('Error loading homepage data:', error);
    return NextResponse.json(defaultData);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Check if KV is available
    if (!process.env.KV_REST_API_URL) {
      return NextResponse.json({ error: "KV storage not configured" }, { status: 500 });
    }

    await kv.set('homepage-data', JSON.stringify(data));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving homepage data:', error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
