"use client";
import { createContext, useContext, useState, useMemo } from "react";
import Link from "next/link";

  const sidebarItems = [
    { id: "branding", label: "Branding", icon: "🎨" },
    { id: "hero", label: "Hero Section", icon: "🏠" },
    { id: "services", label: "Services", icon: "🔧" },
    { id: "about", label: "About", icon: "ℹ️" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "articles", label: "Articles", icon: "📝" },
    { id: "logos", label: "Trusted Logos", icon: "🏢" },
    { id: "chatbot", label: "Chatbot", icon: "🤖" },
    { id: "quotes", label: "Quote Requests", icon: "📋" },
    { id: "api-keys", label: "API Keys", icon: "🔑" },
    { id: "email-config", label: "Email Settings", icon: "📧" },
    { id: "knowledge-base", label: "Knowledge Base", icon: "📚" },
    { id: "chat-history", label: "Chat History", icon: "💬" },
    { id: "user-management", label: "User Management", icon: "👥" },
  ];

// Create context for sharing state between layout and dashboard
const AdminContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({
  activeTab: "branding",
  setActiveTab: () => {},
});

export const useAdminContext = () => useContext(AdminContext);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("branding");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const contextValue = useMemo(() => ({
    activeTab,
    setActiveTab
  }), [activeTab]);

  return (
    <AdminContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-100">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-xl font-semibold text-gray-900">BuildVive Admin</h1>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Website Link */}
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="text-sm">View Website</span>
                </a>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm">Profile</span>
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex pt-16">
          {/* Fixed Sidebar */}
          <div className={`${sidebarOpen ? 'w-64' : 'w-16'} fixed left-0 top-16 bottom-0 bg-white shadow-sm border-r border-gray-200 transition-all duration-300 z-50`}>
            <nav className="p-4 h-full overflow-y-auto">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
