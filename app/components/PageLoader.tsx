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

    // Listen for custom event when homepage data is loaded
    const handleDataLoaded = () => {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
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
