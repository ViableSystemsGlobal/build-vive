import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const SEO_FILE_PATH = path.join(process.cwd(), "data", "seo.json");

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(SEO_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Default SEO settings
const defaultSEOSettings = {
  siteTitle: "BuildVive Renovations - Denver's Premier Construction & Renovation Company",
  siteDescription: "Experience excellence and durability with BuildVive Renovations' Denver team of experts, offering innovative and unmatched residential and commercial solutions tailored to your needs.",
  siteKeywords: "Denver construction, home renovations, commercial construction, residential remodeling, kitchen remodeling, bathroom renovation, construction company Denver, BuildVive Renovations",
  siteAuthor: "BuildVive Renovations",
  siteLanguage: "en",
  
  ogTitle: "BuildVive Renovations - Denver's Premier Construction & Renovation Company",
  ogDescription: "Experience excellence and durability with BuildVive Renovations' Denver team of experts, offering innovative and unmatched residential and commercial solutions tailored to your needs.",
  ogImage: "",
  ogType: "website",
  ogSiteName: "BuildVive Renovations",
  ogLocale: "en_US",
  
  twitterCard: "summary_large_image",
  twitterSite: "@buildvive",
  twitterCreator: "@buildvive",
  twitterTitle: "BuildVive Renovations - Denver's Premier Construction & Renovation Company",
  twitterDescription: "Experience excellence and durability with BuildVive Renovations' Denver team of experts, offering innovative and unmatched residential and commercial solutions tailored to your needs.",
  twitterImage: "",
  
  canonicalUrl: "https://buildvive.com",
  robots: "index, follow",
  googleAnalytics: "",
  googleTagManager: "",
  facebookPixel: "",
  
  organizationName: "BuildVive Renovations",
  organizationLogo: "",
  organizationUrl: "https://buildvive.com",
  organizationPhone: "(555) 123-4567",
  organizationEmail: "info@buildvive.com",
  organizationAddress: "123 Construction Way",
  organizationCity: "Denver",
  organizationState: "CO",
  organizationZipCode: "80202",
  organizationCountry: "US",
  
  businessHours: "Mo-Fr 08:00-17:00, Sa 09:00-15:00",
  priceRange: "$$",
  paymentAccepted: "Cash, Check, Credit Card, Financing",
  currenciesAccepted: "USD"
};

export async function GET() {
  try {
    await ensureDataDirectory();
    
    try {
      const data = await fs.readFile(SEO_FILE_PATH, "utf8");
      const seoSettings = JSON.parse(data);
      return NextResponse.json(seoSettings);
    } catch (error) {
      // File doesn't exist, return default settings
      return NextResponse.json(defaultSEOSettings);
    }
  } catch (error) {
    console.error("Error reading SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to read SEO settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDirectory();
    
    const seoSettings = await request.json();
    
    // Validate required fields
    if (!seoSettings.siteTitle || !seoSettings.siteDescription) {
      return NextResponse.json(
        { error: "Site title and description are required" },
        { status: 400 }
      );
    }
    
    // Merge with defaults to ensure all fields exist
    const mergedSettings = { ...defaultSEOSettings, ...seoSettings };
    
    // Save to file
    await fs.writeFile(SEO_FILE_PATH, JSON.stringify(mergedSettings, null, 2));
    
    console.log("SEO settings saved successfully");
    return NextResponse.json({ success: true, message: "SEO settings saved successfully" });
  } catch (error) {
    console.error("Error saving SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to save SEO settings" },
      { status: 500 }
    );
  }
}
