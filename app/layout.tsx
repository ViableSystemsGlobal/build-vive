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
      title: "Ace Construction - Denver's Premier Construction Company",
      description: "Experience excellence in construction with Denver's most trusted construction company. Quality craftsmanship, innovative solutions, and unmatched service.",
      icons: data.faviconUrl ? {
        icon: data.faviconUrl,
        shortcut: data.faviconUrl,
        apple: data.faviconUrl,
      } : undefined,
    };
  } catch (error) {
    return {
      title: "Ace Construction - Denver's Premier Construction Company",
      description: "Experience excellence in construction with Denver's most trusted construction company. Quality craftsmanship, innovative solutions, and unmatched service.",
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