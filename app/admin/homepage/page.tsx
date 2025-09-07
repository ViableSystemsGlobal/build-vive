"use client";
import { useState, useEffect } from "react";
import ImageUploader from "../../components/ImageUploader";

// Quote Detail Modal Component
function QuoteDetailModal({ quote, isOpen, onClose, onUpdate, onDelete }: {
  quote: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (quoteId: string, status: string, notes: string) => void;
  onDelete: (quoteId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ status: quote?.status || 'new', notes: quote?.notes || '' });

  useEffect(() => {
    if (quote) {
      setEditData({ status: quote.status || 'new', notes: quote.notes || '' });
    }
  }, [quote]);

  if (!isOpen || !quote) return null;

  const getFullAddress = (q: any) => {
    const parts = [q.address, q.city, q.state, q.zipCode].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = () => {
    onUpdate(quote.id, editData.status, editData.notes);
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this quote request? This action cannot be undone.')) {
      onDelete(quote.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quote Request Details</h2>
              <p className="text-gray-600">Submitted on {new Date(quote.timestamp).toLocaleString()}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status || 'new')}`}>
              {quote.status || 'new'}
            </span>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Contact & Project Info */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {quote.name || 'Anonymous'}</div>
                  <div><span className="font-medium">Email:</span> {quote.email || 'Not provided'}</div>
                  <div><span className="font-medium">Phone:</span> {quote.phone || 'Not provided'}</div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Project Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Project Type:</span> {quote.projectType || 'Not specified'}</div>
                  <div><span className="font-medium">Services:</span> {quote.services?.join(', ') || 'Not specified'}</div>
                  <div><span className="font-medium">Location:</span> {getFullAddress(quote)}</div>
                  <div><span className="font-medium">Size:</span> {quote.size || 'Not specified'}</div>
                  <div><span className="font-medium">Timeline:</span> {quote.timeline || 'Not specified'}</div>
                  <div><span className="font-medium">Budget:</span> {quote.budget || 'Not specified'}</div>
                  <div><span className="font-medium">Urgency:</span> {quote.urgency || 'Not specified'}</div>
                </div>
              </div>

              {/* Comments */}
              {quote.comments && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Comments</h3>
                  <p className="text-sm text-gray-700">{quote.comments}</p>
                </div>
              )}
            </div>

            {/* Right Column - Images & Admin Notes */}
            <div className="space-y-6">
              {/* Images */}
              {quote.images && quote.images.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Uploaded Images ({quote.images.length})</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {quote.images.map((image: string, index: number) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.png';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Admin Notes</h3>
                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Notes</label>
                      <textarea
                        value={editData.notes}
                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Add internal notes..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-700 mb-3">{quote.notes || 'No notes added yet.'}</p>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit Status & Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Quote
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// QuotesList Component with Pagination
function QuotesList() {
  const [quotes, setQuotes] = useState<Array<{
    id: string;
    timestamp: string;
    name?: string;
    email?: string;
    phone?: string;
    projectType?: string;
    services?: string[];
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    size?: string;
    timeline?: string;
    budget?: string;
    urgency?: string;
    comments?: string;
    images?: string[];
    status?: string;
    notes?: string;
    [key: string]: unknown;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/quotes");
      if (response.ok) {
        const data = await response.json();
        setQuotes(data.quotes || []);
      } else {
        setError("Failed to load quotes");
      }
    } catch (error) {
      setError("Error loading quotes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (quoteId: string, newStatus: string, notes: string) => {
    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId, status: newStatus, notes })
      });
      
      if (response.ok) {
        // Update local state
        setQuotes(quotes.map(q => 
          q.id === quoteId 
            ? { ...q, status: newStatus, notes } 
            : q
        ));
        // Status updated successfully
      }
    } catch (error) {
      console.error('Failed to update quote:', error);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId })
      });
      
      if (response.ok) {
        setQuotes(quotes.filter(q => q.id !== quoteId));
        setCurrentPage(1); // Reset to first page if current page becomes empty
      }
    } catch (error) {
      console.error('Failed to delete quote:', error);
    }
  };

  const openQuoteModal = (quote: any) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const closeQuoteModal = () => {
    setSelectedQuote(null);
    setIsModalOpen(false);
  };

  // Pagination calculations
  const totalPages = Math.ceil(quotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuotes = quotes.slice(startIndex, endIndex);

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, quotes.length)} of {quotes.length} quotes
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pages}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading quotes...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={loadQuotes}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-lg mb-2">No quote requests yet</div>
        <div className="text-sm">Quote requests will appear here when customers submit forms</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {quotes.length} quote request{quotes.length !== 1 ? 's' : ''}
        </div>
        <button 
          onClick={loadQuotes}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Refresh
        </button>
      </div>
      
      {/* Quote List */}
      <div className="space-y-3">
        {currentQuotes.map((quote) => (
          <div key={quote.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="font-medium text-lg">{quote.name || 'Anonymous'}</div>
                <div className="text-sm text-gray-600">{quote.email} • {quote.phone}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {quote.projectType || 'Not specified'} • {quote.services?.join(', ') || 'No services specified'}
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-xs text-gray-500">{formatDate(quote.timestamp)}</div>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(quote.status || 'new')}`}>
                  {quote.status || 'new'}
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="pt-3 border-t border-gray-200">
              <button
                onClick={() => openQuoteModal(quote)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination />

      {/* Quote Detail Modal */}
      <QuoteDetailModal
        quote={selectedQuote}
        isOpen={isModalOpen}
        onClose={closeQuoteModal}
        onUpdate={handleStatusUpdate}
        onDelete={handleDeleteQuote}
      />
    </div>
  );
}
import FileUploadModal from "../../components/FileUploadModal";

type HomepageData = {
  // Navbar Section
  logoUrl?: string;
  companyName: string;
  
  // Footer Section
  footerLogoUrl?: string;
  footerCompanyName: string;
  footerDescription: string;
  footerAddress: string;
  footerPhone: string;
  footerEmail: string;
  
  // Favicon
  faviconUrl?: string;
  
  // Hero Section
  badge: string;
  headline: string;
  subtext: string;
  heroImage: string;
  trustedUsers: string;
  
  // Services
  services: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    image?: string;
  }>;
  
  // About Section
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
  stats: Array<{
    number: string;
    label: string;
  }>;
  
  // Projects
  projects: Array<{
    id: string;
    title: string;
    description: string;
    badge: string;
    image: string;
    features: Array<string>;
  }>;
  
  // Articles/Blog Posts
  articles: Array<{
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    content: string;
    author: string;
    publishDate: string;
    category: string;
    featured: boolean;
    slug: string;
  }>;
  
  // Trusted Logos
  trustedLogos: Array<{
    id: string;
    imageUrl: string;
    alt: string;
  }>;
  
  // Chatbot Settings
  chatbotGreeting?: string;
  plumbingLeakResponse?: string;
  electricalIssueResponse?: string;
  renovationPlanningResponse?: string;
  maintenanceTipsResponse?: string;
  escalationMessage?: string;
  emergencyPhone?: string;
  
  // API Keys (encrypted)
  openaiApiKey?: string;
  openaiModel?: string;
  twilioApiKey?: string;
  twilioAuthToken?: string;
  twilioPhoneNumber?: string;
  vapiApiKey?: string;
  vapiAssistantId?: string;
  
  // Email Configuration
  smtpHost?: string;
  smtpPort?: string;
  smtpUsername?: string;
  smtpPassword?: string;
  adminEmails?: string;
  fromEmail?: string;
  
  // Knowledge Base
  knowledgeBase?: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    fileName: string;
    fileUrl: string;
    uploadDate: string;
    fileSize: number;
  }>;
  
  // Chat History
  chatHistory?: Array<{
    id: string;
    sessionId: string;
    userId?: string;
    userPhone?: string;
    userName?: string;
    messages: Array<{
      id: string;
      type: 'user' | 'bot';
      content: string;
      timestamp: string;
    }>;
    startTime: string;
    endTime?: string;
    status: 'active' | 'completed' | 'escalated';
    escalationReason?: string;
    tags: string[];
  }>;
};

export default function HomepageAdmin() {
  const [data, setData] = useState<HomepageData>({
    // Navbar Section
    logoUrl: "",
    companyName: "Ace Construction",
    
    // Footer Section
    footerLogoUrl: "",
    footerCompanyName: "Ace Construction",
    footerDescription: "Building excellence in Denver since 2010. Your trusted partner for residential and commercial construction projects.",
    footerAddress: "123 Construction Way, Denver, CO 80202",
    footerPhone: "(555) 123-4567",
    footerEmail: "info@aceconstruction.com",
    
    // Favicon
    faviconUrl: "",
    
    badge: "#1 CONSTRUCTION COMPANY IN DENVER",
    headline: "Unparalleled construction solutions in Denver",
    subtext: "Experience excellence and durability with Ace Construction's Denver team of experts, offering innovative and unmatched residential and commercial solutions tailored to your needs.",
    heroImage: "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop",
    trustedUsers: "Trusted by 1 Million users",
    
    // OpenAI Configuration
    openaiApiKey: "",
    openaiModel: "gpt-4o-mini",
    
    // Chatbot Configuration
    chatbotGreeting: "Thanks for submitting your request! While we process your quote, can I help with some immediate advice?",
    plumbingLeakResponse: "🚨 EMERGENCY: Plumbing leak detected!\n1. Shut off your main water valve immediately\n2. Close all nearby taps and drains\n3. Place buckets under active leaks\n4. Turn off electrical appliances in affected areas\nWould you like us to call you right now for immediate assistance?",
    electricalIssueResponse: "⚡ EMERGENCY: Electrical issue detected!\n1. Turn off power at the main breaker\n2. Do NOT touch any electrical equipment\n3. Keep everyone away from affected areas\n4. Check for any burning smells or smoke\nWould you like us to call you right now for immediate assistance?",
    renovationPlanningResponse: "🏠 Renovation Planning Tips:\n1. Set a realistic budget (add 20% buffer)\n2. Research local permits and regulations\n3. Plan for temporary living arrangements if needed\n4. Choose materials that match your climate\n5. Consider energy efficiency upgrades",
    maintenanceTipsResponse: "🔧 Regular Maintenance Tips:\n1. Inspect roof twice yearly\n2. Clean gutters every 3-6 months\n3. Check HVAC filters monthly\n4. Test smoke detectors quarterly\n5. Schedule annual professional inspection",
    escalationMessage: "We're calling you now! Please keep your phone nearby.",
    emergencyPhone: "(555) 123-4567",
    
    // API Keys
    twilioApiKey: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    vapiApiKey: "",
    vapiAssistantId: "",
    
    // Email Configuration
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    adminEmails: "",
    fromEmail: "",
    
    // Services
    services: [],
    
    // About Section
    aboutTitle: "About Ace Construction",
    aboutDescription: "We are a leading construction company in Denver, Colorado, specializing in residential and commercial projects.",
    aboutImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop",
    
    // Stats
    stats: [],
    
    // Projects
    projects: [],
    
    // Articles
    articles: [],
    
    // Trusted Logos
    trustedLogos: []
  });
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/api/admin/homepage");
      if (response.ok) {
        const homepageData = await response.json();
        // Merge loaded data with defaults to ensure all fields are defined
        setData(prevData => ({
          ...prevData,
          ...homepageData,
          // Ensure arrays are always defined
          services: homepageData.services || prevData.services,
          stats: homepageData.stats || prevData.stats,
          projects: homepageData.projects || prevData.projects,
          articles: homepageData.articles || prevData.articles,
          trustedLogos: homepageData.trustedLogos || prevData.trustedLogos
        }));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading homepage data...</div>
      </div>
    );
  }

  const tabs = [
    { id: "branding", label: "Branding" },
    { id: "hero", label: "Hero Section" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "articles", label: "Articles" },
    { id: "logos", label: "Trusted Logos" },
    { id: "chatbot", label: "Chatbot Settings" },
    { id: "quotes", label: "Quote Requests" },
    { id: "api-keys", label: "API Keys" },
    { id: "email-config", label: "Email Settings" },
    { id: "knowledge-base", label: "Knowledge Base" },
    { id: "chat-history", label: "Chat History" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
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

        {/* Branding Section */}
        {activeTab === "branding" && (
          <div className="bg-white p-6 rounded-lg shadow space-y-8">
            <h2 className="text-xl font-semibold">Branding Settings</h2>
            
            {/* Navbar Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium mb-4">Navbar</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    value={data.companyName}
                    onChange={(e) => setData({ ...data, companyName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Ace Construction"
                  />
                </div>

                <div>
                  <ImageUploader
                    currentImage={data.logoUrl}
                    onImageChange={(imageUrl) => setData({ ...data, logoUrl: imageUrl })}
                    label="Navbar Logo"
                    uniqueKey="navbar-logo"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Navbar Preview</h4>
                  <div className="flex items-center gap-2">
                    {data.logoUrl ? (
                      <img 
                        src={data.logoUrl} 
                        alt="Logo" 
                        className="h-6 w-6 rounded-sm object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-sm border-2 border-orange-500" />
                    )}
                    <span className="font-semibold tracking-wide">{data.companyName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium mb-4">Footer</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    value={data.footerCompanyName}
                    onChange={(e) => setData({ ...data, footerCompanyName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <ImageUploader
                    currentImage={data.footerLogoUrl}
                    onImageChange={(imageUrl) => setData({ ...data, footerLogoUrl: imageUrl })}
                    label="Footer Logo"
                    uniqueKey="footer-logo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={data.footerDescription}
                    onChange={(e) => setData({ ...data, footerDescription: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    value={data.footerAddress}
                    onChange={(e) => setData({ ...data, footerAddress: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="text"
                    value={data.footerPhone}
                    onChange={(e) => setData({ ...data, footerPhone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={data.footerEmail}
                    onChange={(e) => setData({ ...data, footerEmail: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Favicon Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Favicon</h3>
              <p className="text-sm text-gray-600 mb-4">Your favicon automatically uses your main logo. The favicon will appear in browser tabs, bookmarks, and browser history.</p>
              
              <div className="space-y-4">
                {data.logoUrl ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Current Favicon (Using Main Logo)</h4>
                    <div className="flex items-center gap-3">
                      <img 
                        src={data.logoUrl} 
                        alt="Favicon preview" 
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <span className="text-sm text-gray-600">This is how your favicon will appear in browser tabs</span>
                        <br />
                        <span className="text-xs text-gray-500">Automatically synced with your main logo</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="text-sm font-medium mb-2 text-yellow-800">No Logo Set</h4>
                    <p className="text-sm text-yellow-700">
                      Upload a logo in the "Company Logo" section above to automatically set your favicon.
                    </p>
                  </div>
                )}
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> Your favicon automatically uses the same image as your main logo. 
                    For best results, use a square logo image that looks good at small sizes (16x16, 32x32, or 48x48 pixels).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
              <label className="block text-sm font-medium mb-2">Trusted Users Text</label>
              <input
                type="text"
                value={data.trustedUsers}
                onChange={(e) => setData({ ...data, trustedUsers: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="e.g., Trusted by 1 Million users"
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
                    icon: "🔧",
                    image: ""
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  </div>
                  
                  <div className="mb-4">
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
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Service Image</label>
                    <ImageUploader
                      currentImage={service.image}
                      onImageChange={(imageUrl) => {
                        const newServices = [...data.services];
                        newServices[index].image = imageUrl;
                        setData({ ...data, services: newServices });
                      }}
                      label={`Service Image - ${service.title}`}
                      uniqueKey={`service-${service.id}-${index}`}
                    />
                  </div>
                  
                  <div className="flex justify-end">
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
              <ImageUploader
                currentImage={data.aboutImage}
                onImageChange={(imageUrl) => setData({ ...data, aboutImage: imageUrl })}
                label="About Section Image"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Statistics</h3>
              {data.stats.map((stat, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

        {/* Projects Section */}
        {activeTab === "projects" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Projects Portfolio</h2>
              <button
                onClick={() => {
                  const newProject = {
                    id: Date.now().toString(),
                    title: "New Project",
                    description: "Project description",
                    badge: "NEW",
                    image: `https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop&t=${Date.now()}`,
                    features: ["Feature 1", "Feature 2", "Feature 3"]
                  };
                  setData({ ...data, projects: [...data.projects, newProject] });
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Project
              </button>
            </div>

            <div className="space-y-6">
              {data.projects.map((project, index) => {
                console.log(`Rendering project ${index}: id=${project.id}, title=${project.title}, image=${project.image}`);
                return (
                <div key={project.id} className="border border-gray-200 p-6 rounded-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Project Image</label>
                      <div className="text-xs text-gray-500 mb-2">Project ID: {project.id} | Index: {index}</div>
                      <ImageUploader
                        currentImage={project.image}
                        onImageChange={(imageUrl) => {
                          console.log(`Updating project ${project.id} (index ${index}) with image:`, imageUrl);
                          const newProjects = [...data.projects];
                          newProjects[index].image = imageUrl;
                          setData({ ...data, projects: newProjects });
                        }}
                        label={`Project Image - ${project.title}`}
                        uniqueKey={`project-${project.id}-${index}`}
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Badge</label>
                        <input
                          type="text"
                          value={project.badge}
                                                  onChange={(e) => {
                          const newProjects = [...data.projects];
                          newProjects[index].badge = e.target.value;
                          setData({ ...data, projects: newProjects });
                        }}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={project.title}
                                                  onChange={(e) => {
                          const newProjects = [...data.projects];
                          newProjects[index].title = e.target.value;
                          setData({ ...data, projects: newProjects });
                        }}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={project.description}
                                                  onChange={(e) => {
                          const newProjects = [...data.projects];
                          newProjects[index].description = e.target.value;
                          setData({ ...data, projects: newProjects });
                        }}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Features (one per line)</label>
                        <textarea
                          value={project.features.join('\n')}
                                                  onChange={(e) => {
                          const newProjects = [...data.projects];
                          newProjects[index].features = e.target.value.split('\n').filter(f => f.trim());
                          setData({ ...data, projects: newProjects });
                        }}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        const newProjects = data.projects.filter((_, i) => i !== index);
                        setData({ ...data, projects: newProjects });
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete Project
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Articles Section */}
        {activeTab === "articles" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Blog Articles</h2>
              <button
                onClick={() => {
                  const newArticle = {
                    id: Date.now().toString(),
                    title: "New Article",
                    excerpt: "Article excerpt",
                    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400",
                    content: "Write your full article content here...",
                    author: "Admin",
                    publishDate: new Date().toISOString().split('T')[0],
                    category: "General",
                    featured: false,
                    slug: `new-article-${Date.now()}`
                  };
                  setData({ ...data, articles: [...data.articles, newArticle] });
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Article
              </button>
            </div>

            <div className="space-y-6">
              {data.articles.map((article, index) => (
                <div key={article.id} className="border border-gray-200 p-6 rounded-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={article.title}
                        onChange={(e) => {
                          const newArticles = [...data.articles];
                          newArticles[index].title = e.target.value;
                            // Auto-generate slug from title
                            newArticles[index].slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                          setData({ ...data, articles: newArticles });
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                      
                    <div>
                      <label className="block text-sm font-medium mb-1">Excerpt</label>
                        <textarea
                        value={article.excerpt}
                        onChange={(e) => {
                          const newArticles = [...data.articles];
                          newArticles[index].excerpt = e.target.value;
                          setData({ ...data, articles: newArticles });
                        }}
                          rows={3}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Author</label>
                          <input
                            type="text"
                            value={article.author}
                            onChange={(e) => {
                              const newArticles = [...data.articles];
                              newArticles[index].author = e.target.value;
                              setData({ ...data, articles: newArticles });
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Publish Date</label>
                          <input
                            type="date"
                            value={article.publishDate}
                            onChange={(e) => {
                              const newArticles = [...data.articles];
                              newArticles[index].publishDate = e.target.value;
                              setData({ ...data, articles: newArticles });
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <select
                            value={article.category}
                            onChange={(e) => {
                              const newArticles = [...data.articles];
                              newArticles[index].category = e.target.value;
                              setData({ ...data, articles: newArticles });
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                          >
                            <option value="General">General</option>
                            <option value="Construction Tips">Construction Tips</option>
                            <option value="Industry News">Industry News</option>
                            <option value="Project Updates">Project Updates</option>
                            <option value="Safety">Safety</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={article.featured}
                              onChange={(e) => {
                                const newArticles = [...data.articles];
                                newArticles[index].featured = e.target.checked;
                                setData({ ...data, articles: newArticles });
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm font-medium">Featured Article</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                        <input
                          type="text"
                          value={article.slug}
                          onChange={(e) => {
                            const newArticles = [...data.articles];
                            newArticles[index].slug = e.target.value;
                            setData({ ...data, articles: newArticles });
                          }}
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="article-url-slug"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Article Image</label>
                      <ImageUploader
                        currentImage={article.imageUrl}
                        onImageChange={(imageUrl) => {
                          const newArticles = [...data.articles];
                          newArticles[index].imageUrl = imageUrl;
                          setData({ ...data, articles: newArticles });
                        }}
                        label={`Article Image - ${article.title}`}
                          uniqueKey={`article-${article.id}-${index}`}
                      />
                    </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Full Article Content</label>
                        <textarea
                          value={article.content}
                          onChange={(e) => {
                            const newArticles = [...data.articles];
                            newArticles[index].content = e.target.value;
                            setData({ ...data, articles: newArticles });
                          }}
                          rows={12}
                          className="w-full p-3 border border-gray-300 rounded"
                          placeholder="Write your full article content here. You can use HTML tags for formatting..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;em&gt;)
                        </p>
                  </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Preview URL:</span> /blog/{article.slug}
                    </div>
                    <button
                      onClick={() => {
                        const newArticles = data.articles.filter((_, i) => i !== index);
                        setData({ ...data, articles: newArticles });
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete Article
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


        {/* Chatbot Settings Section */}
        {activeTab === "chatbot" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Chatbot Configuration</h2>
              <p className="text-sm text-gray-600 mt-2">Customize your chatbot's responses and behavior</p>
              
              {/* AI Status Indicator */}
              <div className="mt-3 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${data.openaiApiKey ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium">
                  AI Status: {data.openaiApiKey ? 'Active (AI-powered)' : 'Inactive (Rule-based only)'}
                </span>
      </div>
              {!data.openaiApiKey && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ Add your OpenAI API key in the "API Keys" tab to enable AI-powered responses
                </p>
              )}
            </div>

            <div className="space-y-6">
              {/* Greeting Message */}
              <div>
                <label className="block text-sm font-medium mb-2">Greeting Message (after quote submission)</label>
                <textarea
                  value={data.chatbotGreeting}
                  onChange={(e) => setData({ ...data, chatbotGreeting: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter the message that appears when chat opens after quote submission"
                />
              </div>

              {/* Emergency Response Settings */}
              <div>
                <h3 className="text-lg font-medium mb-3">Emergency Response Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Plumbing Leak Response</label>
                    <textarea
                      value={data.plumbingLeakResponse}
                      onChange={(e) => setData({ ...data, plumbingLeakResponse: e.target.value })}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter emergency response for plumbing leaks"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Electrical Issue Response</label>
                    <textarea
                      value={data.electricalIssueResponse}
                      onChange={(e) => setData({ ...data, electricalIssueResponse: e.target.value })}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter emergency response for electrical issues"
                    />
                  </div>
                </div>
              </div>

              {/* General Advice Settings */}
              <div>
                <h3 className="text-lg font-medium mb-3">General Advice Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Renovation Planning Response</label>
                    <textarea
                      value={data.renovationPlanningResponse}
                      onChange={(e) => setData({ ...data, renovationPlanningResponse: e.target.value })}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter response for renovation planning questions"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Maintenance Tips Response</label>
                    <textarea
                      value={data.maintenanceTipsResponse}
                      onChange={(e) => setData({ ...data, maintenanceTipsResponse: e.target.value })}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter response for maintenance questions"
                    />
                  </div>
                </div>
              </div>

              {/* Escalation Settings */}
              <div>
                <h3 className="text-lg font-medium mb-3">Escalation Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Escalation Confirmation Message</label>
                    <textarea
                      value={data.escalationMessage}
                      onChange={(e) => setData({ ...data, escalationMessage: e.target.value })}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter message shown when escalation is triggered"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number for Direct Calls</label>
                    <input
                      type="text"
                      value={data.emergencyPhone}
                      onChange={(e) => setData({ ...data, emergencyPhone: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter emergency contact number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quotes Section */}
        {activeTab === "quotes" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Quote Requests</h2>
              <p className="text-sm text-gray-600 mt-2">View and manage incoming quote requests from your website</p>
            </div>
            
            <QuotesList />
          </div>
        )}

        {/* API Keys Section */}
        {activeTab === "api-keys" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">API Keys & External Services</h2>
              <p className="text-sm text-gray-600 mt-2">Configure external service integrations (keys are encrypted)</p>
            </div>

            <div className="space-y-6">
              {/* OpenAI Configuration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4 text-purple-600">🤖 OpenAI AI Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
                    <input
                      type="password"
                      value={data.openaiApiKey}
                      onChange={(e) => setData({ ...data, openaiApiKey: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm"
                      placeholder="Enter your OpenAI API Key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">AI Model</label>
                    <select
                      value={data.openaiModel}
                      onChange={(e) => setData({ ...data, openaiModel: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cost-effective)</option>
                      <option value="gpt-4o">GPT-4o (Most Capable)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Reliable)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p>This powers your chatbot's AI responses. Choose the model that best fits your needs and budget.</p>
                </div>
              </div>

              {/* Twilio Configuration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4 text-blue-600">📱 Twilio SMS Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Twilio API Key</label>
                    <input
                      type="password"
                      value={data.twilioApiKey}
                      onChange={(e) => setData({ ...data, twilioApiKey: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm"
                      placeholder="Enter your Twilio API Key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Twilio Auth Token</label>
                    <input
                      type="password"
                      value={data.twilioAuthToken}
                      onChange={(e) => setData({ ...data, twilioAuthToken: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm"
                      placeholder="Enter your Twilio Auth Token"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Twilio Phone Number</label>
                    <input
                      type="text"
                      value={data.twilioPhoneNumber}
                      onChange={(e) => setData({ ...data, twilioPhoneNumber: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* VAPI Configuration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4 text-green-600">🎙️ VAPI Voice Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">VAPI API Key</label>
                    <input
                      type="password"
                      value={data.vapiApiKey}
                      onChange={(e) => setData({ ...data, vapiApiKey: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm"
                      placeholder="Enter your VAPI API Key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">VAPI Assistant ID</label>
                    <input
                      type="text"
                      value={data.vapiAssistantId}
                      onChange={(e) => setData({ ...data, vapiAssistantId: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter your VAPI Assistant ID"
                    />
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-amber-600 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">Security Notice</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      API keys are stored securely and encrypted. Never share these keys publicly. 
                      If you suspect a key has been compromised, regenerate it immediately in your service dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Configuration Section */}
        {activeTab === "email-config" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Email Configuration</h2>
              <p className="text-sm text-gray-600 mt-2">Configure SMTP settings and email notifications for quote requests</p>
            </div>

            <div className="space-y-6">
              {/* SMTP Configuration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4 text-green-600">📧 SMTP Configuration (Hostinger)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={data.smtpHost}
                      onChange={(e) => setData({ ...data, smtpHost: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="smtp.hostinger.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">SMTP Port</label>
                    <input
                      type="number"
                      value={data.smtpPort}
                      onChange={(e) => setData({ ...data, smtpPort: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">SMTP Username</label>
                    <input
                      type="email"
                      value={data.smtpUsername}
                      onChange={(e) => setData({ ...data, smtpUsername: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="your-email@yourdomain.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">SMTP Password</label>
                    <input
                      type="password"
                      value={data.smtpPassword}
                      onChange={(e) => setData({ ...data, smtpPassword: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Your email password"
                    />
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p>Configure your Hostinger SMTP settings. Use your domain email credentials.</p>
                </div>
              </div>

              {/* Email Recipients */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4 text-blue-600">📬 Email Recipients</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Notification Emails</label>
                    <textarea
                      value={data.adminEmails}
                      onChange={(e) => setData({ ...data, adminEmails: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md h-24"
                      placeholder="admin@yourdomain.com, manager@yourdomain.com"
                    />
                    <p className="text-sm text-gray-600 mt-1">Enter email addresses separated by commas. These will receive notifications for new quote requests.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">From Email Address</label>
                    <input
                      type="email"
                      value={data.fromEmail}
                      onChange={(e) => setData({ ...data, fromEmail: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="noreply@yourdomain.com"
                    />
                    <p className="text-sm text-gray-600 mt-1">The email address that will appear as the sender.</p>
                  </div>
                </div>
              </div>

              {/* Email Templates Preview */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4 text-purple-600">📝 Email Templates</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Customer Confirmation Email</h4>
                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                      <p><strong>Subject:</strong> Thank you for your quote request - {data.companyName || 'Ace Construction'}</p>
                      <p><strong>Content:</strong> Professional confirmation with quote details and next steps</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Admin Notification Email</h4>
                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                      <p><strong>Subject:</strong> New Quote Request - {data.companyName || 'Ace Construction'}</p>
                      <p><strong>Content:</strong> Complete quote details, customer information, and project requirements</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Email */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4 text-orange-600">🧪 Test Email Configuration</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="email"
                    placeholder="test@example.com"
                    className="flex-1 p-3 border border-gray-300 rounded-md"
                    id="testEmail"
                  />
                  <button
                    onClick={async () => {
                      const testEmail = (document.getElementById('testEmail') as HTMLInputElement)?.value;
                      if (!testEmail) {
                        alert('Please enter a test email address');
                        return;
                      }
                      try {
                        const response = await fetch('/api/test-email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ testEmail })
                        });
                        if (response.ok) {
                          alert('Test email sent successfully!');
                        } else {
                          alert('Failed to send test email. Check your SMTP configuration.');
                        }
                      } catch (error) {
                        alert('Error sending test email');
                      }
                    }}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Send Test Email
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Send a test email to verify your SMTP configuration is working correctly.</p>
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Base Section */}
        {activeTab === "knowledge-base" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Knowledge Base</h2>
                <p className="text-sm text-gray-600 mt-2">Upload and manage construction documents, guides, and resources</p>
              </div>
              <button
                onClick={() => setShowFileUpload(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Upload Document
              </button>
            </div>

            <div className="space-y-4">
              {(data.knowledgeBase || []).map((doc, index) => (
                <div key={doc.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">{doc.title}</h3>
                          <p className="text-sm text-gray-600">{doc.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">{doc.category}</span>
                        <span>{doc.fileName}</span>
                        <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          const newKnowledgeBase = (data.knowledgeBase || []).filter((_, i) => i !== index);
                          setData({ ...data, knowledgeBase: newKnowledgeBase });
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!data.knowledgeBase || data.knowledgeBase.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">No documents uploaded yet</p>
                  <p className="text-sm">Upload construction guides, safety protocols, and other resources to help your team and customers.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat History Section */}
        {activeTab === "chat-history" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Chat History</h2>
              <p className="text-sm text-gray-600 mt-2">Monitor and review all chatbot conversations</p>
            </div>

            <div className="space-y-4">
              {(data.chatHistory || []).map((chat, index) => (
                <div key={chat.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          chat.status === 'active' ? 'bg-green-500' : 
                          chat.status === 'escalated' ? 'bg-red-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="font-medium">Session {chat.sessionId.slice(-8)}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          chat.status === 'active' ? 'bg-green-100 text-green-800' : 
                          chat.status === 'escalated' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {chat.userName && <span className="mr-3">👤 {chat.userName}</span>}
                        {chat.userPhone && <span className="mr-3">📱 {chat.userPhone}</span>}
                        <span>🕐 {new Date(chat.startTime).toLocaleString()}</span>
                        {chat.endTime && <span className="ml-3">⏱️ {new Date(chat.endTime).toLocaleString()}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // TODO: Implement chat detail view
                          alert("Chat detail view coming soon!");
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          const newChatHistory = (data.chatHistory || []).filter((_, i) => i !== index);
                          setData({ ...data, chatHistory: newChatHistory });
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Chat Preview */}
                  <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                    <div className="space-y-2">
                      {chat.messages.slice(0, 3).map((message, msgIndex) => (
                        <div key={msgIndex} className={`text-sm ${
                          message.type === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          <span className={`inline-block px-2 py-1 rounded ${
                            message.type === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content}
                          </span>
                        </div>
                      ))}
                      {chat.messages.length > 3 && (
                        <div className="text-center text-xs text-gray-500">
                          +{chat.messages.length - 3} more messages
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {chat.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {chat.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {(!data.chatHistory || data.chatHistory.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-lg font-medium">No chat history yet</p>
                  <p className="text-sm">Chat conversations will appear here once users start interacting with the chatbot.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        onUpload={(document) => {
          setData(prev => ({
            ...prev!,
            knowledgeBase: [...(prev?.knowledgeBase || []), document]
          }));
        }}
      />
    </div>
  );
}