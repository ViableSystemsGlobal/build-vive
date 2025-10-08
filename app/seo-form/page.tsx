"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "../components/ImageUploader";

type SEOSettings = {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  siteAuthor: string;
  siteLanguage: string;
  
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogSiteName: string;
  ogLocale: string;
  
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  
  canonicalUrl: string;
  robots: string;
  googleAnalytics: string;
  googleTagManager: string;
  facebookPixel: string;
  
  organizationName: string;
  organizationLogo: string;
  organizationUrl: string;
  organizationPhone: string;
  organizationEmail: string;
  organizationAddress: string;
  organizationCity: string;
  organizationState: string;
  organizationZipCode: string;
  organizationCountry: string;
  
  businessHours: string;
  priceRange: string;
  paymentAccepted: string;
  currenciesAccepted: string;
};

export default function SEOFormPage() {
  const router = useRouter();
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    siteTitle: "",
    siteDescription: "",
    siteKeywords: "",
    siteAuthor: "",
    siteLanguage: "en",
    
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",
    ogSiteName: "",
    ogLocale: "en_US",
    
    twitterCard: "summary_large_image",
    twitterSite: "",
    twitterCreator: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    
    canonicalUrl: "",
    robots: "index, follow",
    googleAnalytics: "",
    googleTagManager: "",
    facebookPixel: "",
    
    organizationName: "",
    organizationLogo: "",
    organizationUrl: "",
    organizationPhone: "",
    organizationEmail: "",
    organizationAddress: "",
    organizationCity: "",
    organizationState: "",
    organizationZipCode: "",
    organizationCountry: "US",
    
    businessHours: "Mo-Fr 08:00-17:00, Sa 09:00-15:00",
    priceRange: "$$",
    paymentAccepted: "Cash, Check, Credit Card, Financing",
    currenciesAccepted: "USD"
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/check');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        loadSEOSettings();
      } catch (error) {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  const loadSEOSettings = async () => {
    try {
      const response = await fetch('/api/admin/seo');
      if (response.ok) {
        const data = await response.json();
        setSeoSettings(data);
      }
    } catch (error) {
      console.error('Failed to load SEO settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoSettings)
      });

      if (response.ok) {
        setMessage("SEO settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save SEO settings");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      setMessage("Error saving SEO settings");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SEOSettings, value: string) => {
    setSeoSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Meta Tags */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Basic Meta Tags</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                <input
                  type="text"
                  value={seoSettings.siteTitle}
                  onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your website title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
                <textarea
                  value={seoSettings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Your website description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input
                  type="text"
                  value={seoSettings.siteKeywords}
                  onChange={(e) => handleInputChange('siteKeywords', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={seoSettings.siteAuthor}
                  onChange={(e) => handleInputChange('siteAuthor', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your name or company"
                />
              </div>
            </div>
          </div>

          {/* Open Graph */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Open Graph (Facebook)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                <input
                  type="text"
                  value={seoSettings.ogTitle}
                  onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Open Graph title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                <textarea
                  value={seoSettings.ogDescription}
                  onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Open Graph description"
                />
              </div>
              <div>
                <ImageUploader
                  currentImage={seoSettings.ogImage}
                  onImageChange={(url) => handleInputChange('ogImage', url)}
                  label="OG Image"
                  uniqueKey="og-image"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Type</label>
                <select
                  value={seoSettings.ogType}
                  onChange={(e) => handleInputChange('ogType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="website">Website</option>
                  <option value="article">Article</option>
                  <option value="business.business">Business</option>
                  <option value="place">Place</option>
                </select>
              </div>
            </div>
          </div>

          {/* Twitter Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Twitter Cards</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Card Type</label>
                <select
                  value={seoSettings.twitterCard}
                  onChange={(e) => handleInputChange('twitterCard', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Site</label>
                <input
                  type="text"
                  value={seoSettings.twitterSite}
                  onChange={(e) => handleInputChange('twitterSite', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="@yourtwitterhandle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Creator</label>
                <input
                  type="text"
                  value={seoSettings.twitterCreator}
                  onChange={(e) => handleInputChange('twitterCreator', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="@yourtwitterhandle"
                />
              </div>
              <div>
                <ImageUploader
                  currentImage={seoSettings.twitterImage}
                  onImageChange={(url) => handleInputChange('twitterImage', url)}
                  label="Twitter Image"
                  uniqueKey="twitter-image"
                />
              </div>
            </div>
          </div>

          {/* Analytics & Tracking */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Analytics & Tracking</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                <input
                  type="text"
                  value={seoSettings.googleAnalytics}
                  onChange={(e) => handleInputChange('googleAnalytics', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Tag Manager ID</label>
                <input
                  type="text"
                  value={seoSettings.googleTagManager}
                  onChange={(e) => handleInputChange('googleTagManager', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="GTM-XXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={seoSettings.facebookPixel}
                  onChange={(e) => handleInputChange('facebookPixel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234567890123456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                <input
                  type="url"
                  value={seoSettings.canonicalUrl}
                  onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://yourdomain.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Robots</label>
                <select
                  value={seoSettings.robots}
                  onChange={(e) => handleInputChange('robots', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="index, follow">Index, Follow</option>
                  <option value="index, nofollow">Index, No Follow</option>
                  <option value="noindex, follow">No Index, Follow</option>
                  <option value="noindex, nofollow">No Index, No Follow</option>
                </select>
              </div>
            </div>
          </div>

          {/* Organization Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Organization Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={seoSettings.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <ImageUploader
                  currentImage={seoSettings.organizationLogo}
                  onImageChange={(url) => handleInputChange('organizationLogo', url)}
                  label="Organization Logo"
                  uniqueKey="org-logo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={seoSettings.organizationPhone}
                  onChange={(e) => handleInputChange('organizationPhone', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={seoSettings.organizationEmail}
                  onChange={(e) => handleInputChange('organizationEmail', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="info@yourcompany.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={seoSettings.organizationAddress}
                  onChange={(e) => handleInputChange('organizationAddress', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={seoSettings.organizationCity}
                    onChange={(e) => handleInputChange('organizationCity', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Denver"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={seoSettings.organizationState}
                    onChange={(e) => handleInputChange('organizationState', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="CO"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={seoSettings.organizationZipCode}
                    onChange={(e) => handleInputChange('organizationZipCode', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="80202"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={seoSettings.organizationCountry}
                    onChange={(e) => handleInputChange('organizationCountry', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="US"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Business Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                <input
                  type="text"
                  value={seoSettings.businessHours}
                  onChange={(e) => handleInputChange('businessHours', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mo-Fr 08:00-17:00, Sa 09:00-15:00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  value={seoSettings.priceRange}
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="$">$ (Inexpensive)</option>
                  <option value="$$">$$ (Moderate)</option>
                  <option value="$$$">$$$ (Expensive)</option>
                  <option value="$$$$">$$$$ (Very Expensive)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Accepted</label>
                <input
                  type="text"
                  value={seoSettings.paymentAccepted}
                  onChange={(e) => handleInputChange('paymentAccepted', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cash, Check, Credit Card, Financing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currencies Accepted</label>
                <input
                  type="text"
                  value={seoSettings.currenciesAccepted}
                  onChange={(e) => handleInputChange('currenciesAccepted', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="USD"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
