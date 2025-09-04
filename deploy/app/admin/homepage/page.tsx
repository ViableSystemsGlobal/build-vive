"use client";
import { useState, useEffect } from "react";
import ImageUploader from "../../components/ImageUploader";

type HomepageData = {
  // Hero Section
  badge: string;
  headline: string;
  subtext: string;
  heroImage: string;
  
  // Services
  services: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  
  // About Section
  aboutTitle: string;
  aboutDescription: string;
  stats: Array<{
    number: string;
    label: string;
  }>;
  
  // Articles
  articles: Array<{
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
  }>;
  
  // Trusted Logos
  trustedLogos: Array<{
    id: string;
    imageUrl: string;
    alt: string;
  }>;
};

export default function HomepageAdmin() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/api/admin/homepage");
      if (response.ok) {
        const homepageData = await response.json();
        setData(homepageData);
      } else {
        console.error("Failed to load data");
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setMessage("Homepage updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to save: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      setMessage(`Error saving changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading homepage data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-red-600">Failed to load homepage data</div>
      </div>
    );
  }

  const tabs = [
    { id: "hero", label: "Hero Section" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "articles", label: "Articles" },
    { id: "logos", label: "Trusted Logos" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Homepage Editor</h1>
            <div className="flex items-center space-x-4">
              {message && (
                <div className={`px-4 py-2 rounded ${
                  message.includes("successfully") 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {message}
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Hero Section */}
        {activeTab === "hero" && (
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h2 className="text-xl font-semibold">Hero Section</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Badge Text</label>
              <input
                type="text"
                value={data.badge}
                onChange={(e) => setData({ ...data, badge: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Headline</label>
              <input
                type="text"
                value={data.headline}
                onChange={(e) => setData({ ...data, headline: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subtext</label>
              <textarea
                value={data.subtext}
                onChange={(e) => setData({ ...data, subtext: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <ImageUploader
                currentImage={data.heroImage}
                onImageChange={(imageUrl) => setData({ ...data, heroImage: imageUrl })}
                label="Hero Image"
              />
            </div>
          </div>
        )}

        {/* Services Section */}
        {activeTab === "services" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Services</h2>
              <button
                onClick={() => {
                  const newService = {
                    id: Date.now().toString(),
                    title: "New Service",
                    description: "Service description",
                    icon: "🔧"
                  };
                  setData({ ...data, services: [...data.services, newService] });
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Service
              </button>
            </div>

            <div className="space-y-4">
              {data.services.map((service, index) => (
                <div key={service.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Icon</label>
                      <input
                        type="text"
                        value={service.icon}
                        onChange={(e) => {
                          const newServices = [...data.services];
                          newServices[index].icon = e.target.value;
                          setData({ ...data, services: newServices });
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => {
                          const newServices = [...data.services];
                          newServices[index].title = e.target.value;
                          setData({ ...data, services: newServices });
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <input
                        type="text"
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...data.services];
                          newServices[index].description = e.target.value;
                          setData({ ...data, services: newServices });
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          const newServices = data.services.filter((_, i) => i !== index);
                          setData({ ...data, services: newServices });
                        }}
                        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Section */}
        {activeTab === "about" && (
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h2 className="text-xl font-semibold">About Section</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={data.aboutTitle}
                onChange={(e) => setData({ ...data, aboutTitle: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={data.aboutDescription}
                onChange={(e) => setData({ ...data, aboutDescription: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Statistics</h3>
              {data.stats.map((stat, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Number</label>
                    <input
                      type="text"
                      value={stat.number}
                      onChange={(e) => {
                        const newStats = [...data.stats];
                        newStats[index].number = e.target.value;
                        setData({ ...data, stats: newStats });
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...data.stats];
                        newStats[index].label = e.target.value;
                        setData({ ...data, stats: newStats });
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles Section */}
        {activeTab === "articles" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Articles</h2>
              <button
                onClick={() => {
                  const newArticle = {
                    id: Date.now().toString(),
                    title: "New Article",
                    excerpt: "Article excerpt",
                    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400"
                  };
                  setData({ ...data, articles: [...data.articles, newArticle] });
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Article
              </button>
            </div>

            <div className="space-y-4">
              {data.articles.map((article, index) => (
                <div key={article.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={article.title}
                        onChange={(e) => {
                          const newArticles = [...data.articles];
                          newArticles[index].title = e.target.value;
                          setData({ ...data, articles: newArticles });
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Excerpt</label>
                      <input
                        type="text"
                        value={article.excerpt}
                        onChange={(e) => {
                          const newArticles = [...data.articles];
                          newArticles[index].excerpt = e.target.value;
                          setData({ ...data, articles: newArticles });
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <ImageUploader
                        currentImage={article.imageUrl}
                        onImageChange={(imageUrl) => {
                          const newArticles = [...data.articles];
                          newArticles[index].imageUrl = imageUrl;
                          setData({ ...data, articles: newArticles });
                        }}
                        label={`Article Image - ${article.title}`}
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => {
                        const newArticles = data.articles.filter((_, i) => i !== index);
                        setData({ ...data, articles: newArticles });
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trusted Logos Section */}
        {activeTab === "logos" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Trusted Partner Logos</h2>
              <button
                onClick={() => {
                  const newLogo = {
                    id: Date.now().toString(),
                    imageUrl: "https://via.placeholder.com/120x60/4F46E5/white?text=New+Partner",
                    alt: "New Partner"
                  };
                  setData({ ...data, trustedLogos: [...data.trustedLogos, newLogo] });
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Logo
              </button>
            </div>

            <div className="space-y-4">
              {data.trustedLogos.map((logo, index) => (
                <div key={logo.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={logo.alt}
                        onChange={(e) => {
                          const newLogos = [...data.trustedLogos];
                          newLogos[index].alt = e.target.value;
                          setData({ ...data, trustedLogos: newLogos });
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex justify-end items-end">
                      <button
                        onClick={() => {
                          const newLogos = data.trustedLogos.filter((_, i) => i !== index);
                          setData({ ...data, trustedLogos: newLogos });
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ImageUploader
                      currentImage={logo.imageUrl}
                      onImageChange={(imageUrl) => {
                        const newLogos = [...data.trustedLogos];
                        newLogos[index].imageUrl = imageUrl;
                        setData({ ...data, trustedLogos: newLogos });
                      }}
                      label={`Logo - ${logo.alt}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}