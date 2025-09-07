import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { QuoteProvider } from "./components/QuoteProvider";
import FloatingChat from "./components/FloatingChat";
import DynamicFavicon from "./components/DynamicFavicon";
import { PageLoader } from "./components/PageLoader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/homepage`, {
      cache: 'no-store'
    });
    const data = await response.json();
    
    return {
      title: `${data.companyName || "BuildVive Renovations"} - Denver's Premier Construction & Renovation Company`,
      description: data.subtext || "Experience excellence in construction and renovations with Denver's most trusted team. Quality craftsmanship, innovative solutions, and unmatched service for residential and commercial projects.",
      keywords: "Denver construction, home renovations, commercial construction, residential remodeling, kitchen remodeling, bathroom renovation, construction company Denver, BuildVive Renovations",
      authors: [{ name: data.companyName || "BuildVive Renovations" }],
      creator: data.companyName || "BuildVive Renovations",
      publisher: data.companyName || "BuildVive Renovations",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://buildvive.com',
        siteName: data.companyName || "BuildVive Renovations",
        title: `${data.companyName || "BuildVive Renovations"} - Denver's Premier Construction & Renovation Company`,
        description: data.subtext || "Experience excellence in construction and renovations with Denver's most trusted team. Quality craftsmanship, innovative solutions, and unmatched service.",
        images: data.heroImage ? [
          {
            url: data.heroImage,
            width: 1200,
            height: 630,
            alt: `${data.companyName || "BuildVive Renovations"} - Denver Construction Services`,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${data.companyName || "BuildVive Renovations"} - Denver's Premier Construction & Renovation Company`,
        description: data.subtext || "Experience excellence in construction and renovations with Denver's most trusted team.",
        images: data.heroImage ? [data.heroImage] : [],
      },
      icons: (data.faviconUrl || data.logoUrl) ? {
        icon: data.faviconUrl || data.logoUrl,
        shortcut: data.faviconUrl || data.logoUrl,
        apple: data.faviconUrl || data.logoUrl,
      } : undefined,
    };
  } catch (error) {
    return {
      title: "BuildVive Renovations - Denver's Premier Construction & Renovation Company",
      description: "Experience excellence in construction and renovations with Denver's most trusted team. Quality craftsmanship, innovative solutions, and unmatched service for residential and commercial projects.",
      keywords: "Denver construction, home renovations, commercial construction, residential remodeling, kitchen remodeling, bathroom renovation, construction company Denver, BuildVive Renovations",
      authors: [{ name: "BuildVive Renovations" }],
      creator: "BuildVive Renovations",
      publisher: "BuildVive Renovations",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://buildvive.com',
        siteName: "BuildVive Renovations",
        title: "BuildVive Renovations - Denver's Premier Construction & Renovation Company",
        description: "Experience excellence in construction and renovations with Denver's most trusted team. Quality craftsmanship, innovative solutions, and unmatched service.",
      },
      twitter: {
        card: 'summary_large_image',
        title: "BuildVive Renovations - Denver's Premier Construction & Renovation Company",
        description: "Experience excellence in construction and renovations with Denver's most trusted team.",
      },
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <DynamicFavicon />
      </head>
      <body 
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning={true}
      >
        <QuoteProvider>
          <PageLoader>
            <Navbar />
            <main>{children}</main>
            <FloatingChat />
          </PageLoader>
        </QuoteProvider>
      </body>
    </html>
  );
}