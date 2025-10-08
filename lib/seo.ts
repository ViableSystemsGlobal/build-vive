import { promises as fs } from "fs";
import path from "path";

const SEO_FILE_PATH = path.join(process.cwd(), "data", "seo.json");

export interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  siteAuthor: string;
  siteLanguage: string;
  
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogSiteName: string;
  ogLocale: string;
  
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  
  canonicalUrl: string;
  robots: string;
  googleAnalytics: string;
  googleTagManager: string;
  facebookPixel: string;
  
  organizationName: string;
  organizationLogo: string;
  organizationUrl: string;
  organizationPhone: string;
  organizationEmail: string;
  organizationAddress: string;
  organizationCity: string;
  organizationState: string;
  organizationZipCode: string;
  organizationCountry: string;
  
  businessHours: string;
  priceRange: string;
  paymentAccepted: string;
  currenciesAccepted: string;
}

export async function getSEOSettings(): Promise<SEOSettings> {
  try {
    const data = await fs.readFile(SEO_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading SEO settings:", error);
    // Return default settings if file doesn't exist
    return {
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
  }
}

export function generateStructuredData(seoSettings: SEOSettings) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": seoSettings.organizationName,
    "url": seoSettings.organizationUrl,
    "logo": seoSettings.organizationLogo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": seoSettings.organizationPhone,
      "contactType": "customer service",
      "email": seoSettings.organizationEmail
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": seoSettings.organizationAddress,
      "addressLocality": seoSettings.organizationCity,
      "addressRegion": seoSettings.organizationState,
      "postalCode": seoSettings.organizationZipCode,
      "addressCountry": seoSettings.organizationCountry
    }
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": seoSettings.organizationName,
    "image": seoSettings.organizationLogo,
    "telephone": seoSettings.organizationPhone,
    "email": seoSettings.organizationEmail,
    "url": seoSettings.organizationUrl,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": seoSettings.organizationAddress,
      "addressLocality": seoSettings.organizationCity,
      "addressRegion": seoSettings.organizationState,
      "postalCode": seoSettings.organizationZipCode,
      "addressCountry": seoSettings.organizationCountry
    },
    "openingHours": seoSettings.businessHours,
    "priceRange": seoSettings.priceRange,
    "paymentAccepted": seoSettings.paymentAccepted,
    "currenciesAccepted": seoSettings.currenciesAccepted
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": seoSettings.siteTitle,
    "description": seoSettings.siteDescription,
    "url": seoSettings.canonicalUrl,
    "publisher": {
      "@type": "Organization",
      "name": seoSettings.organizationName,
      "logo": seoSettings.organizationLogo
    }
  };

  return [organization, localBusiness, website];
}

export function generateMetaTags(seoSettings: SEOSettings, pageTitle?: string, pageDescription?: string) {
  const title = pageTitle ? `${pageTitle} | ${seoSettings.siteTitle}` : seoSettings.siteTitle;
  const description = pageDescription || seoSettings.siteDescription;
  const ogTitle = pageTitle ? `${pageTitle} | ${seoSettings.ogTitle}` : seoSettings.ogTitle;
  const ogDescription = pageDescription || seoSettings.ogDescription;

  return {
    title,
    description,
    keywords: seoSettings.siteKeywords,
    author: seoSettings.siteAuthor,
    robots: seoSettings.robots,
    canonical: seoSettings.canonicalUrl,
    
    // Open Graph
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: seoSettings.canonicalUrl,
      siteName: seoSettings.ogSiteName,
      images: seoSettings.ogImage ? [
        {
          url: seoSettings.ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        }
      ] : [],
      locale: seoSettings.ogLocale,
      type: seoSettings.ogType,
    },
    
    // Twitter
    twitter: {
      card: seoSettings.twitterCard,
      site: seoSettings.twitterSite,
      creator: seoSettings.twitterCreator,
      title: ogTitle,
      description: ogDescription,
      images: seoSettings.twitterImage ? [seoSettings.twitterImage] : [],
    },
  };
}
