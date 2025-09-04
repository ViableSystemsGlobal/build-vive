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
        
        if (data.faviconUrl && data.faviconUrl.trim() !== '') {
          // Create new favicon link
          const link = document.createElement('link');
          link.rel = 'icon';
          link.type = 'image/x-icon';
          link.href = data.faviconUrl;
          document.head.appendChild(link);
          
          // Also add shortcut icon
          const shortcutLink = document.createElement('link');
          shortcutLink.rel = 'shortcut icon';
          shortcutLink.type = 'image/x-icon';
          shortcutLink.href = data.faviconUrl;
          document.head.appendChild(shortcutLink);
          
          // Add Apple touch icon
          const appleLink = document.createElement('link');
          appleLink.rel = 'apple-touch-icon';
          appleLink.href = data.faviconUrl;
          document.head.appendChild(appleLink);
          
          console.log('Favicon updated to:', data.faviconUrl);
        } else {
          // Use default favicon if none is set
          const defaultLink = document.createElement('link');
          defaultLink.rel = 'icon';
          defaultLink.type = 'image/x-icon';
          defaultLink.href = '/favicon.ico';
          document.head.appendChild(defaultLink);
          
          console.log('Using default favicon');
        }
      } catch (error) {
        console.error('Failed to update favicon:', error);
        // Fallback to default favicon
        const defaultLink = document.createElement('link');
        defaultLink.rel = 'icon';
        defaultLink.type = 'image/x-icon';
        defaultLink.href = '/favicon.ico';
        document.head.appendChild(defaultLink);
      }
    };

    updateFavicon();
  }, []);

  return null;
}
