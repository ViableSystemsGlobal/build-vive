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
    // Load company data directly from API (same as Navbar)
    const loadCompanyData = async () => {
      try {
        const response = await fetch('/api/admin/homepage');
        if (response.ok) {
          const data = await response.json();
          console.log('PageLoader loaded data:', data);
          setCompanyData({
            logoUrl: data.logoUrl || "",
            companyName: data.companyName || "BuildVive Renovations"
          });
        }
      } catch (error) {
        console.error('Failed to load company data for loader:', error);
      }
    };

    loadCompanyData();

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

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
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
