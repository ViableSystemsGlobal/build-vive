"use client";
import { useEffect, useState } from "react";
import { LoadingScreen } from "./LoadingScreen";

interface PageLoaderProps {
  children: React.ReactNode;
}

export function PageLoader({ children }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState({
    logoUrl: "",
    companyName: "BuildVive Renovations"
  });

  useEffect(() => {
    // Listen for custom event when homepage data is loaded
    const handleDataLoaded = (event: any) => {
      // Update company data with the real data from the main page
      if (event.detail) {
        setCompanyData({
          logoUrl: event.detail.logoUrl || "",
          companyName: event.detail.companyName || "BuildVive Renovations"
        });
      }
      
      // Wait for the main content to actually render before hiding loading screen
      const checkForContent = () => {
        const mainContent = document.querySelector('[data-main-content]');
        if (mainContent) {
          // Content is rendered, hide loading screen
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        } else {
          // Content not ready yet, check again
          setTimeout(checkForContent, 100);
        }
      };
      
      checkForContent();
    };

    window.addEventListener('homepageDataLoaded', handleDataLoaded);

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      window.removeEventListener('homepageDataLoaded', handleDataLoaded);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <LoadingScreen 
          logoUrl={companyData.logoUrl}
          companyName={companyData.companyName}
        />
      )}
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        {children}
      </div>
    </>
  );
}
