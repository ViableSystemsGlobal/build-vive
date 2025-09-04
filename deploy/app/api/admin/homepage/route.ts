import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "homepage.json");

// Default data
const defaultData = {
  badge: "#1 CONSTRUCTION COMPANY IN DENVER",
  headline: "Unparalleled construction solutions in Denver",
  subtext: "Experience excellence and durability with Ace Construction's Denver team of experts, offering innovative and unmatched residential and commercial solutions tailored to your needs.",
  heroImage: "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop",
  
  services: [
    { id: "1", title: "Residential Construction", description: "Custom homes and renovations", icon: "🏠" },
    { id: "2", title: "Commercial Projects", description: "Office buildings and retail spaces", icon: "🏢" },
    { id: "3", title: "Renovations", description: "Complete home and office makeovers", icon: "🔨" },
  ],
  
  aboutTitle: "Building Excellence Since 2010",
  aboutDescription: "With over a decade of experience in Denver's construction industry, we've built our reputation on quality craftsmanship and customer satisfaction.",
  
  stats: [
    { number: "500+", label: "Projects Completed" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Client Satisfaction" },
  ],
  
  articles: [
    { id: "1", title: "Modern Construction Techniques", excerpt: "Discover the latest innovations in construction", imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400" },
    { id: "2", title: "Sustainable Building Practices", excerpt: "How we're building for the future", imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400" },
    { id: "3", title: "Denver Construction Trends", excerpt: "What's popular in Denver construction", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400" },
  ],
  
  trustedLogos: [
    { id: "1", imageUrl: "https://via.placeholder.com/120x60/4F46E5/white?text=Partner+1", alt: "Partner 1" },
    { id: "2", imageUrl: "https://via.placeholder.com/120x60/059669/white?text=Partner+2", alt: "Partner 2" },
    { id: "3", imageUrl: "https://via.placeholder.com/120x60/DC2626/white?text=Partner+3", alt: "Partner 3" },
  ]
};

export async function GET() {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return Response.json(JSON.parse(data));
  } catch (error) {
    console.log("No homepage data file found, returning defaults");
    return Response.json(defaultData);
  }
}

export async function POST(request: Request) {
  try {
    console.log("Saving homepage data...");
    const data = await request.json();
    
    // Create data directory if it doesn't exist
    try {
      await mkdir(DATA_DIR, { recursive: true });
      console.log("Data directory created/verified");
    } catch (error) {
      console.log("Data directory already exists or creation failed:", error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error));
    }
    
    // Save the data
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    console.log("Homepage data saved successfully");
    
    return Response.json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    console.error("Failed to save homepage data:", error);
    return Response.json({ 
      error: "Failed to save data", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}