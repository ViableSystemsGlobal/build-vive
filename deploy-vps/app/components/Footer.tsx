"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type FooterData = {
  footerLogoUrl?: string;
  footerCompanyName: string;
  footerDescription: string;
  footerAddress: string;
  footerPhone: string;
  footerEmail: string;
};

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData>({
    footerCompanyName: "BuildVive Renovations",
    footerDescription: "Building excellence in Denver since 2010.",
    footerAddress: "123 Construction Way, Denver, CO 80202",
    footerPhone: "(555) 123-4567",
    footerEmail: "info@buildvive.com",
  });

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const response = await fetch('/api/admin/homepage');
        if (response.ok) {
          const data = await response.json();
          setFooterData({
            footerLogoUrl: data.footerLogoUrl || "",
            footerCompanyName: data.footerCompanyName || "BuildVive Renovations",
            footerDescription: data.footerDescription || "Building excellence in Denver since 2010.",
            footerAddress: data.footerAddress || "123 Construction Way, Denver, CO 80202",
            footerPhone: data.footerPhone || "(555) 123-4567",
            footerEmail: data.footerEmail || "info@buildvive.com",
          });
        }
      } catch (error) {
        console.error('Failed to load footer data:', error);
      }
    };

    loadFooterData();
  }, []);

  return (
    <footer id="contact" className="bg-[#0f1216] text-white py-16 mt-4">
      <div className="container-page grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2">
            {footerData.footerLogoUrl ? (
              <Image 
                src={footerData.footerLogoUrl} 
                alt="Logo" 
                width={24} 
                height={24} 
                className="h-6 w-6 rounded-sm"
              />
            ) : (
              <div className="h-6 w-6 rounded-sm border-2 border-primary" />
            )}
            <span className="font-semibold tracking-wide">
              {footerData.footerCompanyName}
            </span>
          </div>
          <p className="mt-4 text-sm opacity-80 max-w-sm">
            {footerData.footerDescription}
          </p>
          <div className="mt-6 flex items-center gap-4 opacity-70 text-sm">
            <span>Instagram</span>
            <span>Twitter</span>
            <span>Facebook</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Contact Info</h4>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li>{footerData.footerAddress}</li>
            <li>{footerData.footerPhone}</li>
            <li>{footerData.footerEmail}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#about">About</Link></li>
            <li><Link href="/#services">Services</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
            <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Panel</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-page mt-12 border-t border-white/10 pt-6 text-center text-xs opacity-70">
        Copyright © {new Date().getFullYear()} {footerData.footerCompanyName}. All Rights Reserved.
      </div>
    </footer>
  );
}
