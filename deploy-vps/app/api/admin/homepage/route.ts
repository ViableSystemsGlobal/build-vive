import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { storage } from "../../../lib/storage";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "homepage.json");

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
    { id: "1", title: "Modern Home Construction", description: "Complete custom home build with premium materials and energy-efficient design.", badge: "RESIDENTIAL", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1400&auto=format&fit=crop", features: ["Custom design", "Energy efficient", "Premium materials"] },
    { id: "2", title: "Office Complex Development", description: "Multi-story office building with modern amenities and sustainable features.", badge: "COMMERCIAL", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop", features: ["Modern design", "Sustainable features", "Premium amenities"] },
    { id: "3", title: "Historic Building Restoration", description: "Careful restoration preserving architectural integrity while modernizing systems.", badge: "RENOVATION", image: "https://images.unsplash.com/photo-1577962917302-cd874c8f14d6?q=80&w=1400&auto=format&fit=crop", features: ["Heritage preservation", "Modern systems", "Historical accuracy"] },
  ],
  
  articles: [
    { 
      id: "1", 
      title: "Planning a home renovation in Denver: what to know", 
      excerpt: "From permits to materials, here are the essentials for a smooth renovation project in Colorado.", 
      imageUrl: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1400&auto=format&fit=crop",
      content: `<h2>Planning Your Denver Home Renovation</h2>
<p>Renovating a home in Denver requires careful planning and understanding of local regulations. Here's what you need to know:</p>

<h3>Permits and Regulations</h3>
<p>Denver has specific building codes and permit requirements that vary by project type. Before starting any renovation:</p>
<ul>
<li>Check if your project requires a permit</li>
<li>Understand zoning restrictions</li>
<li>Consider HOA requirements if applicable</li>
</ul>

<h3>Climate Considerations</h3>
<p>Denver's unique climate affects material choices and construction timing:</p>
<ul>
<li>Choose weather-resistant materials</li>
<li>Plan for temperature fluctuations</li>
<li>Consider insulation upgrades</li>
</ul>

<h3>Budget Planning</h3>
<p>Set aside 20% of your budget for unexpected costs and always get multiple quotes from licensed contractors.</p>`,
      author: "Ace Construction Team",
      publishDate: "2024-01-15",
      category: "Construction Tips",
      featured: true,
      slug: "planning-home-renovation-denver"
    },
    { 
      id: "2", 
      title: "Commercial build‑outs: timeline and budgeting tips", 
      excerpt: "A practical overview of schedules, contingencies, and cost controls for tenant improvements.", 
      imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1400&auto=format&fit=crop",
      content: `<h2>Commercial Build-Out Planning Guide</h2>
<p>Commercial tenant improvements require careful planning to stay on schedule and budget.</p>

<h3>Timeline Planning</h3>
<p>Typical commercial build-out timelines:</p>
<ul>
<li>Design phase: 2-4 weeks</li>
<li>Permit approval: 2-6 weeks</li>
<li>Construction: 4-12 weeks</li>
<li>Final inspections: 1-2 weeks</li>
</ul>

<h3>Budget Considerations</h3>
<p>Include these costs in your budget:</p>
<ul>
<li>Design and engineering fees</li>
<li>Permit costs</li>
<li>Construction materials and labor</li>
<li>Contingency fund (10-15%)</li>
</ul>

<h3>Common Challenges</h3>
<p>Be prepared for potential delays due to permit issues, material shortages, or unexpected structural requirements.</p>`,
      author: "Ace Construction Team",
      publishDate: "2024-01-10",
      category: "Industry News",
      featured: false,
      slug: "commercial-buildout-timeline-budgeting"
    },
    { 
      id: "3", 
      title: "Choosing materials that last in Colorado's climate", 
      excerpt: "Weather-resistant materials and construction techniques for Denver's unique climate conditions.", 
      imageUrl: "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop",
      content: `<h2>Colorado Climate-Resistant Materials</h2>
<p>Denver's climate presents unique challenges for construction materials. Here's what works best:</p>

<h3>Exterior Materials</h3>
<p>Choose materials that can handle:</p>
<ul>
<li>Temperature swings from -10°F to 100°F</li>
<li>Low humidity and UV exposure</li>
<li>Occasional hail and wind</li>
</ul>

<h3>Recommended Options</h3>
<p>Best materials for Denver construction:</p>
<ul>
<li>Fiber cement siding</li>
<li>Metal roofing</li>
<li>Concrete and stone</li>
<li>High-quality vinyl windows</li>
</ul>

<h3>Maintenance Tips</h3>
<p>Regular maintenance is key to longevity in Colorado's climate. Schedule annual inspections and touch-ups.</p>`,
      author: "Ace Construction Team",
      publishDate: "2024-01-05",
      category: "Construction Tips",
      featured: false,
      slug: "colorado-climate-resistant-materials"
    },
  ],
  
  trustedLogos: [
    { id: "1", imageUrl: "https://via.placeholder.com/120x60/4F46E5/white?text=Partner+1", alt: "Partner 1" },
    { id: "2", imageUrl: "https://via.placeholder.com/120x60/059669/white?text=Partner+2", alt: "Partner 2" },
    { id: "3", imageUrl: "https://via.placeholder.com/120x60/DC2626/white?text=Partner+3", alt: "Partner 3" },
  ]
};

export async function GET() {
  try {
    // Try storage service first
    const data = await storage.get('homepage-data');
    if (data) {
      return Response.json(data);
    }

    // Fallback to file system
    try {
      const fileData = await readFile(DATA_FILE, "utf-8");
      const parsedData = JSON.parse(fileData);
      // Migrate to storage service
      await storage.set('homepage-data', parsedData);
      return Response.json(parsedData);
    } catch (fileError) {
      // If file doesn't exist, return default data and initialize storage
      await storage.set('homepage-data', defaultData);
      return Response.json(defaultData);
    }
  } catch (error) {
    console.error('Error loading homepage data:', error);
    return Response.json(defaultData);
  }
}

export async function POST(request: Request) {
  try {
    console.log("Saving homepage data...");
    const data = await request.json();
    
    // Try storage service first
    const success = await storage.set('homepage-data', data);
    
    if (success) {
      console.log("Homepage data saved to storage service successfully");
      return Response.json({ success: true, storage: storage.getStorageType() });
    }
    
    // Fallback to file system
    try {
      await mkdir(DATA_DIR, { recursive: true });
      console.log("Data directory created/verified");
    } catch (error) {
      console.log("Data directory already exists or creation failed:", error instanceof Error ? error.message : String(error));
    }
    
    // Save the data to file system as backup
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    console.log("Homepage data saved to file system successfully");
    
    return Response.json({ success: true, storage: 'file' });
  } catch (error) {
    console.error("Failed to save homepage data:", error);
    return Response.json({ 
      error: "Failed to save data", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}