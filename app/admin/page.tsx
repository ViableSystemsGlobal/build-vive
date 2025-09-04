"use client";
import Link from "next/link";

export default function AdminDashboard() {
  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-28">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/homepage" className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors">
              <h3 className="text-lg font-semibold mb-2">Homepage Editor</h3>
              <p className="text-gray-600">Edit hero section, services, about, articles, and trusted logos</p>
            </Link>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Services</h3>
              <p className="text-gray-600">Add and edit construction services</p>
              <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Articles</h3>
              <p className="text-gray-600">Manage blog posts and articles</p>
              <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Media Library</h3>
              <p className="text-gray-600">Upload and manage images</p>
              <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Site Settings</h3>
              <p className="text-gray-600">Company info and general settings</p>
              <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Contact Forms</h3>
              <p className="text-gray-600">View submitted quote requests</p>
              <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}