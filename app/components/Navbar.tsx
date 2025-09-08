"use client";

import { useState, useEffect } from "react";
import { useQuote } from "./QuoteProvider";

export default function Navbar() {
  const { openQuote } = useQuote();
  const [activeSection, setActiveSection] = useState("home");
  const [navbarData, setNavbarData] = useState({
    logoUrl: "",
    companyName: "BuildVive Renovations"
  });

  useEffect(() => {
    // Load navbar data
    const loadNavbarData = async () => {
      try {
        const response = await fetch('/api/admin/homepage');
        if (response.ok) {
          const data = await response.json();
          setNavbarData({
            logoUrl: data.logoUrl || "",
            companyName: data.companyName || "BuildVive Renovations"
          });
        }
      } catch (error) {
        console.error('Failed to load navbar data:', error);
      }
    };

    loadNavbarData();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {navbarData.logoUrl ? (
              <img 
                src={navbarData.logoUrl} 
                alt="Logo" 
                className="h-8 w-8 rounded object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded border-2 border-primary" />
            )}
            <span className="font-bold text-xl text-gray-900">
              {navbarData.companyName}
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'home' ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'about' ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'services' ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'projects' ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'contact' ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Contact
            </button>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={openQuote}
              className="btn-primary text-sm"
            >
              Get Quote
            </button>
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
