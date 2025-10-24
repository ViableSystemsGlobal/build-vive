"use client";

import { useEffect } from 'react';

export default function DynamicFavicon() {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const response = await fetch('/api/admin/homepage');
        const data = await response.json();
        
        // Remove existing favicon links
        const existingLinks = document.querySelectorAll('link[rel*="icon"]');
        existingLinks.forEach(link => link.remove());
        
        // Use logo URL for favicon (same as loading screen)
        const faviconUrl = data.logoUrl || data.faviconUrl;
        
        if (faviconUrl && faviconUrl.trim() !== '') {
          // Create new favicon link
          const link = document.createElement('link');
          link.rel = 'icon';
          link.type = 'image/x-icon';
          link.href = faviconUrl;
          document.head.appendChild(link);
          
          // Also add shortcut icon
          const shortcutLink = document.createElement('link');
          shortcutLink.rel = 'shortcut icon';
          shortcutLink.type = 'image/x-icon';
          shortcutLink.href = faviconUrl;
          document.head.appendChild(shortcutLink);
          
          // Add Apple touch icon
          const appleLink = document.createElement('link');
          appleLink.rel = 'apple-touch-icon';
          appleLink.href = faviconUrl;
          document.head.appendChild(appleLink);
          
          console.log('Favicon updated to:', faviconUrl);
        } else {
          // Don't show any favicon if none is set (more professional)
          console.log('No favicon set - keeping blank');
        }
      } catch (error) {
        console.error('Failed to update favicon:', error);
        // Don't show any favicon on error (more professional)
        console.log('Favicon error - keeping blank');
      }
    };

    updateFavicon();
  }, []);

  return null;
}
