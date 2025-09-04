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
    companyName: "Ace Construction"
  });

  useEffect(() => {
    // Fetch company data for the loading screen
    const fetchCompanyData = async () => {
      try {
        const response = await fetch('/api/admin/homepage');
        if (response.ok) {
          const data = await response.json();
          setCompanyData({
            logoUrl: data.logoUrl || "",
            companyName: data.companyName || "Ace Construction"
          });
        }
      } catch (error) {
        console.error('Failed to load company data:', error);
      }
    };

    fetchCompanyData();

    // Wait for page to be fully loaded
    const handleLoad = () => {
      // Small delay to ensure everything is rendered
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => {
      window.removeEventListener('load', handleLoad);
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
