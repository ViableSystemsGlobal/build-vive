import { Inter } from "next/font/google";
import "./globals.css";
import { QuoteProvider } from "./components/QuoteProvider";
import DynamicFavicon from "./components/DynamicFavicon";
import { PageLoader } from "./components/PageLoader";
import ConditionalNavbar from "./components/ConditionalNavbar";
import { getSEOSettings, generateMetaTags, generateStructuredData } from "../lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata() {
  try {
    // Get SEO settings
    const seoSettings = await getSEOSettings();
    
    // Get homepage data for fallback
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/homepage`, {
      cache: 'no-store'
    });
    const homepageData = await response.json();
    
    // Generate meta tags using SEO settings
    const metaTags = generateMetaTags(seoSettings);
    
    return {
      title: metaTags.title,
      description: metaTags.description,
      keywords: metaTags.keywords,
      authors: [{ name: metaTags.author }],
      creator: metaTags.author,
      publisher: metaTags.author,
      robots: metaTags.robots,
      openGraph: metaTags.openGraph,
      twitter: metaTags.twitter,
      icons: (homepageData.faviconUrl || homepageData.logoUrl) ? {
        icon: homepageData.faviconUrl || homepageData.logoUrl,
        shortcut: homepageData.faviconUrl || homepageData.logoUrl,
        apple: homepageData.faviconUrl || homepageData.logoUrl,
      } : undefined,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback to default metadata
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get SEO settings for structured data and analytics
  let seoSettings;
  try {
    seoSettings = await getSEOSettings();
  } catch (error) {
    console.error("Error loading SEO settings:", error);
    seoSettings = null;
  }

  const structuredData = seoSettings ? generateStructuredData(seoSettings) : [];

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <DynamicFavicon />
        
        {/* Structured Data */}
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(data)
            }}
          />
        ))}
        
        {/* Google Analytics */}
        {seoSettings?.googleAnalytics && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${seoSettings.googleAnalytics}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${seoSettings.googleAnalytics}');
                `
              }}
            />
          </>
        )}
        
        {/* Google Tag Manager */}
        {seoSettings?.googleTagManager && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${seoSettings.googleTagManager}');
                `
              }}
            />
          </>
        )}
        
        {/* Facebook Pixel */}
        {seoSettings?.facebookPixel && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${seoSettings.facebookPixel}');
                fbq('track', 'PageView');
              `
            }}
          />
        )}
      </head>
      <body 
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning={true}
      >
        {/* Google Tag Manager (noscript) */}
        {seoSettings?.googleTagManager && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${seoSettings.googleTagManager}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        
        {/* Facebook Pixel (noscript) */}
        {seoSettings?.facebookPixel && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${seoSettings.facebookPixel}&ev=PageView&noscript=1`}
            />
          </noscript>
        )}
        
        <QuoteProvider>
          <PageLoader>
            <ConditionalNavbar>
              <main>{children}</main>
            </ConditionalNavbar>
          </PageLoader>
        </QuoteProvider>
      </body>
    </html>
  );
}
