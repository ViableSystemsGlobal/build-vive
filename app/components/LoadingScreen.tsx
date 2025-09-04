"use client";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  logoUrl?: string;
  companyName?: string;
}

export function LoadingScreen({ logoUrl, companyName = "Ace Construction" }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // Wait for page to be fully loaded
    const handleLoad = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Small delay to show 100% completion
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Fallback timeout in case load event doesn't fire
    const fallbackTimeout = setTimeout(() => {
      handleLoad();
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo */}
        <div className="relative">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-16 w-16 rounded-lg object-cover animate-pulse"
            />
          ) : (
            <div className="h-16 w-16 rounded-lg border-4 border-primary animate-pulse" />
          )}
          {/* Spinning ring around logo */}
          <div className="absolute inset-0 rounded-lg border-4 border-transparent border-t-primary animate-spin" />
        </div>

        {/* Company Name */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{companyName}</h1>
          <p className="text-gray-600">Loading your experience...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="text-sm text-gray-500 font-medium">
          {Math.round(progress)}%
        </div>

        {/* Loading Dots Animation */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
