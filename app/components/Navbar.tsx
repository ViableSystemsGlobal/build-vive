"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuote } from "./QuoteProvider";

export function Navbar() {
  const { openQuote } = useQuote();
  const [activeSection, setActiveSection] = useState("home");
  const [navbarData, setNavbarData] = useState({
    logoUrl: "",
    companyName: "Ace Construction"
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
            companyName: data.companyName || "Ace Construction"
          });
        }
      } catch (error) {
        console.error('Failed to load navbar data:', error);
      }
    };

    loadNavbarData();

    const handleScroll = () => {
      const sections = ["home", "about", "services", "projects", "blog", "contact"];
      const scrollPosition = window.scrollY + 100; // Offset for navbar height
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (section: string) => activeSection === section;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/5 shadow-sm">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {navbarData.logoUrl ? (
            <img 
              src={navbarData.logoUrl} 
              alt="Logo" 
              className="h-6 w-6 rounded-sm object-cover"
            />
          ) : (
            <div className="h-6 w-6 rounded-sm border-2 border-primary" />
          )}
          <span className="font-semibold tracking-wide">{navbarData.companyName}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link 
            className={`transition-colors ${isActive("home") ? "text-primary font-semibold" : "hover:text-primary"}`} 
            href="/"
          >
            Home
          </Link>
          <Link 
            className={`transition-colors ${isActive("about") ? "text-primary font-semibold" : "hover:text-primary"}`} 
            href="/#about"
          >
            About
          </Link>
          <Link 
            className={`transition-colors ${isActive("services") ? "text-primary font-semibold" : "hover:text-primary"}`} 
            href="/#services"
          >
            Services
          </Link>
          <Link 
            className={`transition-colors ${isActive("projects") ? "text-primary font-semibold" : "hover:text-primary"}`} 
            href="/#projects"
          >
            Projects
          </Link>
          <Link 
            className={`transition-colors ${isActive("blog") ? "text-primary font-semibold" : "hover:text-primary"}`} 
            href="/blog"
          >
            Blog
          </Link>
          <Link 
            className={`transition-colors ${isActive("contact") ? "text-primary font-semibold" : "hover:text-primary"}`} 
            href="/#contact"
          >
            Contact
          </Link>
        </nav>
        <button
          onClick={openQuote}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Get a Free Quote
        </button>
      </div>
    </header>
  );
}
