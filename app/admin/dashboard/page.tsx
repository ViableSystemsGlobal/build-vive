"use client";
import { useState, useEffect } from "react";
import ImageUploader from "../../components/ImageUploader";
import { useAdminContext } from "../layout";

// This will contain all the functionality from the homepage editor
// but organized with sidebar navigation

export default function AdminDashboard() {
  const { activeTab, setActiveTab } = useAdminContext();
  
  const [data, setData] = useState({
    // All the data from homepage editor
    companyName: "BuildVive Renovations",
    logoUrl: "",
    footerCompanyName: "BuildVive Renovations",
    footerDescription: "Building excellence in Denver since 2010. Your trusted partner for residential and commercial construction projects.",
    footerAddress: "123 Construction Way, Denver, CO 80202",
    footerPhone: "(555) 123-4567",
    footerEmail: "info@buildvive.com",
    faviconUrl: "",
    badge: "#1 CONSTRUCTION COMPANY IN DENVER",
    headline: "Unparalleled construction solutions in Denver",
    subtext: "Experience excellence and durability with BuildVive Renovations' Denver team of experts, offering innovative and unmatched residential and commercial solutions tailored to your needs.",
    heroImage: "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop",
    trustedUsers: "Trusted by 1 Million users",
    openaiApiKey: "",
    openaiModel: "gpt-4o-mini",
    chatbotGreeting: "Thanks for submitting your request! While we process your quote, can I help with some immediate advice?",
    plumbingLeakResponse: "🚨 EMERGENCY: Plumbing leak detected!\n1. Shut off your main water valve immediately\n2. Close all nearby taps and drains\n3. Place buckets under active leaks\n4. Turn off electrical appliances in affected areas\nWould you like us to call you right now for immediate assistance?",
    electricalIssueResponse: "⚡ EMERGENCY: Electrical issue detected!\n1. Turn off power at the main breaker\n2. Do NOT touch any electrical equipment\n3. Keep everyone away from affected areas\n4. Check for any burning smells or smoke\nWould you like us to call you right now for immediate assistance?",
    renovationPlanningResponse: "🏠 Renovation Planning Tips:\n1. Set a realistic budget (add 20% buffer)\n2. Research local permits and regulations\n3. Plan for temporary living arrangements if needed\n4. Choose materials that match your climate\n5. Consider energy efficiency upgrades",
    maintenanceTipsResponse: "🔧 Regular Maintenance Tips:\n1. Inspect roof twice yearly\n2. Clean gutters every 3-6 months\n3. Check HVAC filters monthly\n4. Test smoke detectors quarterly\n5. Schedule annual professional inspection",
    escalationMessage: "We're calling you now! Please keep your phone nearby.",
    emergencyPhone: "(555) 123-4567",
    twilioApiKey: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    vapiApiKey: "",
    vapiAssistantId: "",
    vapiPhoneNumberId: "",
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    adminEmails: "",
    fromEmail: "",
    recaptchaEnabled: false,
    recaptchaSiteKey: "",
    recaptchaSecretKey: "",
    services: [],
    aboutTitle: "About BuildVive Renovations",
    aboutDescription: "We are a leading construction company in Denver, Colorado, specializing in residential and commercial projects.",
    aboutImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop",
    stats: [],
    projects: [],
    articles: [],
    trustedLogos: [],
    knowledgeBase: [],
    chatHistory: [],
    quotes: []
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [testEmail, setTestEmail] = useState('');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState(null);
  const [quotesPage, setQuotesPage] = useState(1);
  const [quotesPerPage] = useState(10);
  const [chatHistoryPage, setChatHistoryPage] = useState(1);
  const [chatHistoryPerPage] = useState(10);
  const [quotationFile, setQuotationFile] = useState<File | null>(null);
  const [isUploadingQuotation, setIsUploadingQuotation] = useState(false);
  const [isLoadingChatHistory, setIsLoadingChatHistory] = useState(false);
  const [isLoadingKnowledgeBase, setIsLoadingKnowledgeBase] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
    loadQuotes();
  }, []);

  // Load data when specific tabs are accessed
  useEffect(() => {
    if (activeTab === "knowledge-base") {
      loadKnowledgeBase();
    } else if (activeTab === "chat-history") {
      loadChatHistory();
      setChatHistoryPage(1); // Reset to first page when switching to chat history
    } else if (activeTab === "quotes") {
      setQuotesPage(1); // Reset to first page when switching to quotes
    }
  }, [activeTab]);

  const loadData = async () => {
    try {
      const response = await fetch("/api/admin/homepage");
      if (response.ok) {
        const homepageData = await response.json();
        setData(prevData => ({
          ...prevData,
          ...homepageData,
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

  const saveData = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage("Data saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save data");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage("Error saving data");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const loadQuotes = async () => {
    try {
      const response = await fetch("/api/admin/quotes");
      if (response.ok) {
        const quotesData = await response.json();
        setData(prevData => ({
          ...prevData,
          quotes: quotesData.quotes || []
        }));
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
    }
  };

  const loadChatHistory = async () => {
    if (isLoadingChatHistory) return; // Prevent multiple simultaneous requests
    
    setIsLoadingChatHistory(true);
    try {
      const response = await fetch("/api/admin/chat-history");
      if (response.ok) {
        const chatData = await response.json();
        const chatHistory = chatData.chatHistory || [];
        
        // Add sample data if no chat history exists (for testing)
        if (chatHistory.length === 0) {
          const sampleChat = {
            id: "sample_chat_1",
            sessionId: "session_123",
            userId: "user_456",
            userPhone: "+1234567890",
            userName: "John Doe",
            messages: [
              {
                id: "msg_1",
                type: "user",
                content: "Hello, I need help with my construction project",
                timestamp: new Date().toISOString()
              },
              {
                id: "msg_2", 
                type: "bot",
                content: "Hi John! I'd be happy to help you with your construction project. What type of project are you working on?",
                timestamp: new Date().toISOString()
              },
              {
                id: "msg_3",
                type: "user", 
                content: "I need to renovate my kitchen",
                timestamp: new Date().toISOString()
              }
            ],
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            status: "completed",
            escalationReason: null,
            tags: ["kitchen", "renovation"]
          };
          chatHistory.push(sampleChat);
        }
        
        setData(prevData => ({
          ...prevData,
          chatHistory: chatHistory
        }));
      } else {
        console.error("Failed to load chat history:", response.status);
        setData(prevData => ({
          ...prevData,
          chatHistory: []
        }));
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setData(prevData => ({
        ...prevData,
        chatHistory: []
      }));
    } finally {
      setIsLoadingChatHistory(false);
    }
  };

  const loadKnowledgeBase = async () => {
    if (isLoadingKnowledgeBase) return; // Prevent multiple simultaneous requests
    
    setIsLoadingKnowledgeBase(true);
    try {
      const response = await fetch("/api/admin/knowledge-base");
      if (response.ok) {
        const kbData = await response.json();
        setData(prevData => ({
          ...prevData,
          knowledgeBase: kbData.documents || []
        }));
      } else {
        console.error("Failed to load knowledge base:", response.status);
        setData(prevData => ({
          ...prevData,
          knowledgeBase: []
        }));
      }
    } catch (error) {
      console.error("Error loading knowledge base:", error);
      setData(prevData => ({
        ...prevData,
        knowledgeBase: []
      }));
    } finally {
      setIsLoadingKnowledgeBase(false);
    }
  };

  const handleQuoteStatusUpdate = async (quoteId: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId, status, notes })
      });

      if (response.ok) {
        // Reload quotes to get updated data
        await loadQuotes();
        setMessage(`Quote ${status} successfully`);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage('Failed to update quote status');
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error('Error updating quote status:', error);
      setMessage('Error updating quote status');
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleQuotationUpload = async (quoteId: string) => {
    if (!quotationFile) {
      alert('Please select a quotation file to upload');
      return;
    }

    setIsUploadingQuotation(true);
    try {
      // Upload the quotation file
      const formData = new FormData();
      formData.append('file', quotationFile);
      formData.append('type', 'quotation');
      formData.append('quoteId', quoteId);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        const quotationUrl = uploadResult.url;

        // Update quote status to approved with quotation URL and response time
        const quote = data.quotes?.find(q => q.id === quoteId);
        const responseTime = quote ? Date.now() - new Date(quote.timestamp).getTime() : 0;
        const responseTimeHours = Math.round(responseTime / (1000 * 60 * 60) * 100) / 100;

        const response = await fetch('/api/admin/quotes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            quoteId, 
            status: 'approved', 
            quotationUrl,
            responseTimeHours,
            approvedAt: new Date().toISOString()
          })
        });

        if (response.ok) {
          await loadQuotes();
          setQuotationFile(null);
          setMessage(`Quote approved successfully! Response time: ${responseTimeHours} hours`);
          setTimeout(() => setMessage(""), 5000);
        } else {
          setMessage('Failed to approve quote');
          setTimeout(() => setMessage(""), 3000);
        }
      } else {
        setMessage('Failed to upload quotation file');
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error('Error uploading quotation:', error);
      setMessage('Error uploading quotation');
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsUploadingQuotation(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) return;
    
    setIsTestingEmail(true);
    setTestEmailResult(null);
    
    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testEmail }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setTestEmailResult({
          success: true,
          message: result.message
        });
      } else {
        setTestEmailResult({
          success: false,
          error: result.error || 'Failed to send test email'
        });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      setTestEmailResult({
        success: false,
        error: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with Save Button */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex items-center space-x-4">
            {message && (
              <div className={`px-4 py-2 rounded ${
                message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {message}
              </div>
            )}
            <button
              onClick={saveData}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>


      {/* Content will be rendered based on activeTab */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === "branding" && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">Branding Settings</h3>
            
            {/* Navbar Section */}
            <div className="border-b border-gray-200 pb-6">
              <h4 className="text-lg font-medium mb-4">Navbar</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    value={data.companyName}
                    onChange={(e) => setData({ ...data, companyName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="BuildVive Renovations"
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
                  <h5 className="text-sm font-medium mb-2">Navbar Preview</h5>
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
              <h4 className="text-lg font-medium mb-4">Footer</h4>
              
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
              <h4 className="text-lg font-medium mb-4">Favicon</h4>
              
              <div>
                <ImageUploader
                  currentImage={data.faviconUrl}
                  onImageChange={(imageUrl) => setData({ ...data, faviconUrl: imageUrl })}
                  label="Favicon (16x16 or 32x32 pixels recommended)"
                  uniqueKey="favicon"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "hero" && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">Hero Section</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Badge Text</label>
                <input
                  type="text"
                  value={data.badge}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="#1 CONSTRUCTION COMPANY IN DENVER"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Headline</label>
                <input
                  type="text"
                  value={data.headline}
                  onChange={(e) => setData({ ...data, headline: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Unparalleled construction solutions in Denver"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subtext</label>
                <textarea
                  value={data.subtext}
                  onChange={(e) => setData({ ...data, subtext: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Experience excellence and durability..."
                />
              </div>

              <div>
                <ImageUploader
                  currentImage={data.heroImage}
                  onImageChange={(imageUrl) => setData({ ...data, heroImage: imageUrl })}
                  label="Hero Background Image"
                  uniqueKey="hero-image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Trusted Users Text</label>
                <input
                  type="text"
                  value={data.trustedUsers}
                  onChange={(e) => setData({ ...data, trustedUsers: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Trusted by 1 Million users"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Services</h3>
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

        {activeTab === "about" && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">About Section</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">About Title</label>
                <input
                  type="text"
                  value={data.aboutTitle}
                  onChange={(e) => setData({ ...data, aboutTitle: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="About BuildVive Renovations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">About Description</label>
                <textarea
                  value={data.aboutDescription}
                  onChange={(e) => setData({ ...data, aboutDescription: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows={6}
                  placeholder="We are a leading construction company..."
                />
              </div>

              <div>
                <ImageUploader
                  currentImage={data.aboutImage}
                  onImageChange={(imageUrl) => setData({ ...data, aboutImage: imageUrl })}
                  label="About Section Image"
                  uniqueKey="about-image"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Projects Portfolio</h3>
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
              {data.projects.map((project, index) => (
                <div key={project.id} className="border border-gray-200 p-6 rounded-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Project Image</label>
                      <ImageUploader
                        currentImage={project.image}
                        onImageChange={(imageUrl) => {
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
              ))}
            </div>
          </div>
        )}

        {activeTab === "articles" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Blog Articles</h3>
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
                  <div className="mt-4 flex justify-end">
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

        {activeTab === "logos" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Trusted Partner Logos</h3>
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
                      uniqueKey={`logo-${logo.id}-${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "chatbot" && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">Chatbot Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Greeting Message</label>
                <textarea
                  value={data.chatbotGreeting}
                  onChange={(e) => setData({ ...data, chatbotGreeting: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Thanks for submitting your request!..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Emergency Phone</label>
                <input
                  type="text"
                  value={data.emergencyPhone}
                  onChange={(e) => setData({ ...data, emergencyPhone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Escalation Message</label>
                <input
                  type="text"
                  value={data.escalationMessage}
                  onChange={(e) => setData({ ...data, escalationMessage: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="We're calling you now! Please keep your phone nearby."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "quotes" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold">Quote Requests</h3>
              <p className="text-sm text-gray-600 mt-2">View and manage incoming quote requests from your website</p>
            </div>

            {/* Quote Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{data.quotes?.length || 0}</div>
                <div className="text-sm text-gray-600">Total Quotes</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {data.quotes?.filter(quote => quote.status === 'approved').length || 0}
                </div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {data.quotes?.filter(quote => !quote.status || quote.status === 'pending').length || 0}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">
                  {data.quotes?.filter(quote => quote.status === 'rejected').length || 0}
                </div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {(() => {
                    const approvedQuotes = data.quotes?.filter(quote => quote.status === 'approved' && quote.responseTimeHours) || [];
                    if (approvedQuotes.length === 0) return '0.00';
                    const avgResponseTime = approvedQuotes.reduce((sum, quote) => sum + quote.responseTimeHours, 0) / approvedQuotes.length;
                    return Math.round(avgResponseTime * 100) / 100;
                  })()}h
                </div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
            </div>

            {/* Response Time Statistics */}
            {data.quotes?.filter(quote => quote.status === 'approved' && quote.responseTimeHours).length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium mb-4">Response Time Analytics</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {(() => {
                        const approvedQuotes = data.quotes?.filter(quote => quote.status === 'approved' && quote.responseTimeHours) || [];
                        const avgResponseTime = approvedQuotes.reduce((sum, quote) => sum + quote.responseTimeHours, 0) / approvedQuotes.length;
                        return avgResponseTime ? Math.round(avgResponseTime * 100) / 100 : 0;
                      })()}h
                    </div>
                    <div className="text-sm text-gray-600">Average Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {(() => {
                        const approvedQuotes = data.quotes?.filter(quote => quote.status === 'approved' && quote.responseTimeHours) || [];
                        const fastQuotes = approvedQuotes.filter(quote => quote.responseTimeHours <= 0.5);
                        return fastQuotes.length;
                      })()}
                    </div>
                    <div className="text-sm text-gray-600">Quotes Under 30min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {(() => {
                        const approvedQuotes = data.quotes?.filter(quote => quote.status === 'approved' && quote.responseTimeHours) || [];
                        const mediumQuotes = approvedQuotes.filter(quote => quote.responseTimeHours > 0.5 && quote.responseTimeHours <= 2);
                        return mediumQuotes.length;
                      })()}
                    </div>
                    <div className="text-sm text-gray-600">30min - 2h</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {(() => {
                        const approvedQuotes = data.quotes?.filter(quote => quote.status === 'approved' && quote.responseTimeHours) || [];
                        const slowQuotes = approvedQuotes.filter(quote => quote.responseTimeHours > 2);
                        return slowQuotes.length;
                      })()}
                    </div>
                    <div className="text-sm text-gray-600">Quotes Over 2h</div>
                  </div>
                </div>
              </div>
            )}

            {/* Quote Requests List */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">Quote Requests</h4>
                <div className="text-sm text-gray-600">
                  Showing {((quotesPage - 1) * quotesPerPage) + 1} to {Math.min(quotesPage * quotesPerPage, data.quotes?.length || 0)} of {data.quotes?.length || 0} quotes
                </div>
              </div>
              
              <div className="space-y-4">
                {data.quotes?.slice((quotesPage - 1) * quotesPerPage, quotesPage * quotesPerPage).map((quote, index) => (
                  <div key={quote.id} className="border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Quote #{quote.id}
                        </h5>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>Submitted: {new Date(quote.timestamp).toLocaleString()}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                            quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            !quote.status || quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {quote.status || 'pending'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab(`quote-detail-${quote.id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            const newQuotes = data.quotes?.filter((_, i) => i !== index) || [];
                            setData({ ...data, quotes: newQuotes });
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Name:</strong> {quote.name || 'N/A'}
                      </div>
                      <div>
                        <strong>Email:</strong> {quote.email || 'N/A'}
                      </div>
                      <div>
                        <strong>Phone:</strong> {quote.phone || 'N/A'}
                      </div>
                      <div>
                        <strong>Project Type:</strong> {quote.projectType || 'N/A'}
                      </div>
                      <div>
                        <strong>Images:</strong> 
                        {quote.images && quote.images.length > 0 ? (
                          <span className="text-green-600 font-medium">
                            {quote.images.length} image{quote.images.length > 1 ? 's' : ''} uploaded
                          </span>
                        ) : (
                          <span className="text-gray-500">No images</span>
                        )}
                      </div>
                      {quote.status === 'approved' && quote.responseTimeHours && (
                        <div>
                          <strong>Response Time:</strong> 
                          <span className={`font-medium ${
                            quote.responseTimeHours <= 0.5 ? 'text-green-600' :
                            quote.responseTimeHours <= 2 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {quote.responseTimeHours}h
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {quote.message && (
                      <div className="mt-3 text-sm">
                        <strong>Message:</strong>
                        <p className="text-gray-600 mt-1">{quote.message}</p>
                      </div>
                    )}
                  </div>
                ))}
                {(!data.quotes || data.quotes.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No quote requests yet</p>
                    <p className="text-sm">Quote requests will appear here when customers submit the contact form</p>
                  </div>
                )}
              </div>
              
              {/* Pagination Controls */}
              {data.quotes && data.quotes.length > quotesPerPage && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {quotesPage} of {Math.ceil(data.quotes.length / quotesPerPage)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuotesPage(Math.max(1, quotesPage - 1))}
                      disabled={quotesPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.ceil(data.quotes.length / quotesPerPage) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setQuotesPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            page === quotesPage
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setQuotesPage(Math.min(Math.ceil(data.quotes.length / quotesPerPage), quotesPage + 1))}
                      disabled={quotesPage === Math.ceil(data.quotes.length / quotesPerPage)}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Quote Detail View - Separate Section */}
        {activeTab.startsWith("quote-detail-") && (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">Quote Request Details</h4>
                <button
                  onClick={() => setActiveTab("quotes")}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← Back to List
                </button>
              </div>
              {(() => {
                const quoteId = activeTab.replace("quote-detail-", "");
                const quote = data.quotes?.find(q => q.id === quoteId);
                if (!quote) return <div>Quote not found</div>;
                
                return (
                  <div className="space-y-6">
                    {/* Status Indicator */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                        quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        !quote.status || quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {quote.status || 'pending'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-3">Customer Information</h5>
                        <div className="space-y-2 text-sm">
                          <div><strong>Name:</strong> {quote.name || 'N/A'}</div>
                          <div><strong>Email:</strong> {quote.email || 'N/A'}</div>
                          <div><strong>Phone:</strong> {quote.phone || 'N/A'}</div>
                          <div><strong>Company:</strong> {quote.company || 'N/A'}</div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-3">Project Details</h5>
                        <div className="space-y-2 text-sm">
                          <div><strong>Project Type:</strong> {quote.projectType || 'N/A'}</div>
                          <div><strong>Budget:</strong> {quote.budget || 'N/A'}</div>
                          <div><strong>Timeline:</strong> {quote.timeline || 'N/A'}</div>
                          <div><strong>Status:</strong> {quote.status || 'pending'}</div>
                        </div>
                      </div>
                    </div>
                    
                    {quote.message && (
                      <div>
                        <h5 className="font-medium mb-3">Message</h5>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{quote.message}</p>
                        </div>
                      </div>
                    )}
                    
                    {quote.images && quote.images.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-3">Uploaded Images</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {quote.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.startsWith('data:') ? image : `/uploads/${image}`}
                                alt={`Quote image ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => {
                                  // Open image in new tab for full view
                                  window.open(image.startsWith('data:') ? image : `/uploads/${image}`, '_blank');
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Click on any image to view full size</p>
                      </div>
                    )}
                    
                    <div>
                      <h5 className="font-medium mb-3">Actions</h5>
                      
                      {quote.status === 'approved' ? (
                        <div className="flex items-center gap-4">
                          <span className="px-4 py-2 bg-green-100 text-green-800 rounded font-medium">
                            ✓ Approved
                          </span>
                          {quote.quotationUrl && (
                            <a 
                              href={quote.quotationUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors"
                            >
                              View Quotation
                            </a>
                          )}
                          {quote.responseTimeHours && (
                            <span className="text-sm text-gray-600">
                              Response time: {quote.responseTimeHours} hours
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                              onChange={(e) => setQuotationFile(e.target.files?.[0] || null)}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <button 
                              onClick={() => handleQuotationUpload(quote.id)}
                              disabled={!quotationFile || isUploadingQuotation}
                              className={`px-4 py-2 rounded text-white font-medium transition-colors ${
                                !quotationFile || isUploadingQuotation
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-green-600 hover:bg-green-700'
                              }`}
                            >
                              {isUploadingQuotation ? 'Uploading...' : 'Upload & Approve'}
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">
                            Upload quotation document to approve this quote
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-4 mt-4">
                        <button 
                          onClick={() => {
                            const notes = prompt('Please enter additional information needed:');
                            if (notes) {
                              handleQuoteStatusUpdate(quote.id, 'pending', notes);
                            }
                          }}
                          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 font-medium transition-colors"
                        >
                          Request More Info
                        </button>
                        <button 
                          onClick={() => {
                            const confirmed = confirm('Are you sure you want to reject this quote?');
                            if (confirmed) {
                              const notes = prompt('Please enter reason for rejection (optional):');
                              handleQuoteStatusUpdate(quote.id, 'rejected', notes || undefined);
                            }
                          }}
                          disabled={quote.status === 'rejected'}
                          className={`px-4 py-2 rounded text-white font-medium transition-colors ${
                            quote.status === 'rejected' 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          {quote.status === 'rejected' ? '✗ Rejected' : 'Reject Quote'}
                        </button>
                      </div>
                    </div>
                    
                    {quote.notes && (
                      <div>
                        <h5 className="font-medium mb-3">Admin Notes</h5>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-700">{quote.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === "api-keys" && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">API Keys</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
                <input
                  type="password"
                  value={data.openaiApiKey}
                  onChange={(e) => setData({ ...data, openaiApiKey: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="sk-..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">OpenAI Model</label>
                <select
                  value={data.openaiModel}
                  onChange={(e) => setData({ ...data, openaiModel: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twilio API Key</label>
                <input
                  type="password"
                  value={data.twilioApiKey}
                  onChange={(e) => setData({ ...data, twilioApiKey: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="AC..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twilio Auth Token</label>
                <input
                  type="password"
                  value={data.twilioAuthToken}
                  onChange={(e) => setData({ ...data, twilioAuthToken: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twilio Phone Number</label>
                <input
                  type="text"
                  value={data.twilioPhoneNumber}
                  onChange={(e) => setData({ ...data, twilioPhoneNumber: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">VAPI API Key</label>
                <input
                  type="password"
                  value={data.vapiApiKey}
                  onChange={(e) => setData({ ...data, vapiApiKey: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="..."
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
              <div>
                <label className="block text-sm font-medium mb-2">VAPI Phone Number ID</label>
                <input
                  type="text"
                  value={data.vapiPhoneNumberId}
                  onChange={(e) => setData({ ...data, vapiPhoneNumberId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter your VAPI Phone Number ID"
                />
              </div>
            </div>

            {/* reCAPTCHA Settings */}
            <div className="border-t border-gray-200 pt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Google reCAPTCHA Settings</h4>
              <p className="text-sm text-gray-600 mb-6">
                Configure Google reCAPTCHA to protect your quote form and admin login from spam and bots.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recaptchaEnabled"
                    checked={data.recaptchaEnabled}
                    onChange={(e) => setData({ ...data, recaptchaEnabled: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="recaptchaEnabled" className="ml-2 block text-sm font-medium text-gray-900">
                    Enable reCAPTCHA Protection
                  </label>
                </div>

                {data.recaptchaEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">reCAPTCHA Site Key</label>
                      <input
                        type="text"
                        value={data.recaptchaSiteKey}
                        onChange={(e) => setData({ ...data, recaptchaSiteKey: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="6Lc..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Get this from Google reCAPTCHA console</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">reCAPTCHA Secret Key</label>
                      <input
                        type="password"
                        value={data.recaptchaSecretKey}
                        onChange={(e) => setData({ ...data, recaptchaSecretKey: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="6Lc..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Keep this secret - used for server-side verification</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-medium text-blue-900 mb-2">Setup Instructions:</h5>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Go to <a href="https://www.google.com/recaptcha/admin" target="_blank" rel="noopener noreferrer" className="underline">Google reCAPTCHA Console</a></li>
                        <li>Create a new site with reCAPTCHA v2 "I'm not a robot" checkbox</li>
                        <li>Add your domain(s) to the site list</li>
                        <li>Copy the Site Key and Secret Key above</li>
                        <li>Save your settings</li>
                      </ol>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "email-config" && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">Email Settings</h3>
            
            <div className="space-y-4">
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
                  placeholder="your-email@buildvive.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">SMTP Password</label>
                <input
                  type="password"
                  value={data.smtpPassword}
                  onChange={(e) => setData({ ...data, smtpPassword: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="your-email-password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Admin Emails (comma-separated)</label>
                <input
                  type="text"
                  value={data.adminEmails}
                  onChange={(e) => setData({ ...data, adminEmails: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="admin@buildvive.com, manager@buildvive.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">From Email</label>
                <input
                  type="email"
                  value={data.fromEmail}
                  onChange={(e) => setData({ ...data, fromEmail: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="noreply@buildvive.com"
                />
              </div>
            </div>

            {/* Test Email Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-blue-900 mb-4">Test Email Configuration</h4>
              <p className="text-sm text-blue-700 mb-4">
                Send a test email to verify your SMTP configuration is working correctly.
              </p>
              
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Test Email Address</label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="your-email@example.com"
                  />
                </div>
                <button
                  onClick={handleTestEmail}
                  disabled={!testEmail || isTestingEmail}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isTestingEmail ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Testing...
                    </>
                  ) : (
                    'Send Test Email'
                  )}
                </button>
              </div>
              
              {testEmailResult && (
                <div className={`mt-4 p-3 rounded-md ${
                  testEmailResult.success 
                    ? 'bg-green-100 border border-green-300 text-green-800' 
                    : 'bg-red-100 border border-red-300 text-red-800'
                }`}>
                  {testEmailResult.success ? (
                    <div>
                      <p className="font-medium">✅ Test email sent successfully!</p>
                      <p className="text-sm mt-1">Check your inbox for the test email.</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">❌ Failed to send test email</p>
                      <p className="text-sm mt-1">{testEmailResult.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "knowledge-base" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Knowledge Base</h3>
                <p className="text-sm text-gray-600 mt-2">Manage documents and FAQ content for your chatbot</p>
                {isLoadingKnowledgeBase && (
                  <p className="text-sm text-blue-600 mt-1">Loading knowledge base...</p>
                )}
              </div>
              <button
                onClick={() => setActiveTab("knowledge-base-add")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Document
              </button>
            </div>

            {/* Knowledge Base Documents List */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium mb-4">Knowledge Base Documents</h4>
              <div className="space-y-4">
                {data.knowledgeBase?.map((doc, index) => (
                  <div key={doc.id} className="border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{doc.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Category: {doc.category}</span>
                          <span>Size: {(doc.fileSize / 1024).toFixed(1)} KB</span>
                          <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
                        <button
                          onClick={() => {
                            const newDocs = data.knowledgeBase?.filter((_, i) => i !== index) || [];
                            setData({ ...data, knowledgeBase: newDocs });
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!data.knowledgeBase || data.knowledgeBase.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No documents uploaded yet</p>
                    <p className="text-sm">Upload documents to help your chatbot answer customer questions</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Document Form */}
            {activeTab === "knowledge-base-add" && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium mb-4">Add New Document</h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  // Handle document upload here
                  setActiveTab("knowledge-base");
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Document Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="e.g., Construction Safety Guidelines"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Brief description of the document content"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      name="category"
                      required
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Category</option>
                      <option value="Safety">Safety</option>
                      <option value="Construction">Construction</option>
                      <option value="FAQ">FAQ</option>
                      <option value="Policies">Policies</option>
                      <option value="Procedures">Procedures</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Document File</label>
                    <input
                      type="file"
                      name="file"
                      required
                      accept=".pdf,.doc,.docx,.txt"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX, TXT</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Upload Document
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("knowledge-base")}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === "chat-history" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold">Chat History</h3>
              <p className="text-sm text-gray-600 mt-2">View and analyze customer chat interactions</p>
              {isLoadingChatHistory && (
                <p className="text-sm text-blue-600 mt-1">Loading chat history...</p>
              )}
            </div>

            {/* Chat History Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{data.chatHistory?.length || 0}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {data.chatHistory?.filter(chat => chat.status === 'completed').length || 0}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {data.chatHistory?.filter(chat => chat.status === 'escalated').length || 0}
                </div>
                <div className="text-sm text-gray-600">Escalated</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {data.chatHistory?.filter(chat => chat.status === 'active').length || 0}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>

            {/* Chat History List */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">Recent Chat Sessions</h4>
                <div className="text-sm text-gray-600">
                  Showing {((chatHistoryPage - 1) * chatHistoryPerPage) + 1} to {Math.min(chatHistoryPage * chatHistoryPerPage, data.chatHistory?.length || 0)} of {data.chatHistory?.length || 0} sessions
                </div>
              </div>
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                  <strong>Debug:</strong> {data.chatHistory?.length || 0} chat sessions loaded
                  {data.chatHistory?.length > 0 && (
                    <div>First chat ID: {data.chatHistory[0]?.id}</div>
                  )}
                </div>
              )}
              <div className="space-y-4">
                {data.chatHistory?.slice((chatHistoryPage - 1) * chatHistoryPerPage, chatHistoryPage * chatHistoryPerPage).map((chat, index) => (
                  <div key={chat.id} className="border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Session: {chat.sessionId}
                        </h5>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>Started: {new Date(chat.startTime).toLocaleString()}</span>
                          {chat.endTime && (
                            <span>Ended: {new Date(chat.endTime).toLocaleString()}</span>
                          )}
                          <span className={`px-2 py-1 rounded text-xs ${
                            chat.status === 'completed' ? 'bg-green-100 text-green-800' :
                            chat.status === 'escalated' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {chat.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab(`chat-detail-${chat.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Details
                      </button>
                    </div>
                    
                    {chat.userName && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>User:</strong> {chat.userName}
                        {chat.userPhone && ` (${chat.userPhone})`}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600">
                      <strong>Messages:</strong> {chat.messages.length}
                      {chat.escalationReason && (
                        <span className="ml-4 text-yellow-600">
                          <strong>Escalation:</strong> {chat.escalationReason}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {(!data.chatHistory || data.chatHistory.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No chat sessions yet</p>
                    <p className="text-sm">Chat history will appear here when customers interact with your chatbot</p>
                  </div>
                )}
              </div>
              
              {/* Pagination Controls */}
              {data.chatHistory && data.chatHistory.length > chatHistoryPerPage && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {chatHistoryPage} of {Math.ceil(data.chatHistory.length / chatHistoryPerPage)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setChatHistoryPage(Math.max(1, chatHistoryPage - 1))}
                      disabled={chatHistoryPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.ceil(data.chatHistory.length / chatHistoryPerPage) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setChatHistoryPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            page === chatHistoryPage
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setChatHistoryPage(Math.min(Math.ceil(data.chatHistory.length / chatHistoryPerPage), chatHistoryPage + 1))}
                      disabled={chatHistoryPage === Math.ceil(data.chatHistory.length / chatHistoryPerPage)}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Detail View */}
            {activeTab.startsWith("chat-detail-") && (() => {
              const chatId = activeTab.replace("chat-detail-", "");
              const chat = data.chatHistory?.find(c => c.id === chatId);
              
              // Debug logging (only in development)
              if (process.env.NODE_ENV === 'development') {
                console.log('Chat Detail Debug:', {
                  activeTab,
                  chatId,
                  chatHistory: data.chatHistory,
                  foundChat: chat
                });
              }
              
              return (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium">Chat Session Details</h4>
                    <button
                      onClick={() => setActiveTab("chat-history")}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ← Back to List
                    </button>
                  </div>
                  
                  {!chat ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Chat session not found</p>
                      <p className="text-sm">The chat session you're looking for doesn't exist or has been deleted.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Session ID:</strong> {chat.sessionId}</div>
                        <div><strong>Status:</strong> {chat.status}</div>
                        <div><strong>Start Time:</strong> {new Date(chat.startTime).toLocaleString()}</div>
                        <div><strong>End Time:</strong> {chat.endTime ? new Date(chat.endTime).toLocaleString() : 'N/A'}</div>
                      </div>
                      
                      {chat.userName && (
                        <div className="text-sm">
                          <strong>User:</strong> {chat.userName}
                          {chat.userPhone && ` (${chat.userPhone})`}
                        </div>
                      )}
                      
                      <div className="border-t pt-4">
                        <h5 className="font-medium mb-3">Conversation</h5>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {chat.messages && chat.messages.length > 0 ? (
                            chat.messages.map((message, idx) => (
                              <div key={idx} className={`p-3 rounded-lg ${
                                message.type === 'user' 
                                  ? 'bg-blue-50 ml-8' 
                                  : 'bg-gray-50 mr-8'
                              }`}>
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-700">
                                      {message.type === 'user' ? 'Customer' : 'Bot'}
                                    </div>
                                    <div className="text-gray-900 mt-1">{message.content}</div>
                                  </div>
                                  <div className="text-xs text-gray-500 ml-2">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              <p>No messages in this chat session</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold">Admin Profile</h3>
              <p className="text-sm text-gray-600 mt-2">Manage your admin account settings</p>
            </div>
            
            <div className="space-y-6">
              {/* Profile Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium mb-4">Profile Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value="admin@buildvive.local"
                      onChange={(e) => setData({ ...data, adminEmail: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <input
                      type="text"
                      value="Super Admin"
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Last Login</label>
                  <input
                    type="text"
                    value="Active Now"
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Update Password
                    </button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium mb-4">Account Actions</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-blue-900">Update Email Address</h5>
                      <p className="text-sm text-blue-700">Change your admin email address</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Update Email
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-yellow-900">Security Settings</h5>
                      <p className="text-sm text-yellow-700">Manage two-factor authentication and security</p>
                    </div>
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                      Security
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "user-management" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold">User Management</h3>
              <p className="text-sm text-gray-600 mt-2">Manage admin users and access permissions</p>
            </div>
            
            <div className="space-y-6">
              {/* Current Admin User */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium mb-4">Current Admin User</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value="admin@buildvive.local"
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <input
                      type="text"
                      value="Super Admin"
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Last Login</label>
                  <input
                    type="text"
                    value="Active Now"
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              {/* Add New User */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium mb-4">Add New Admin User</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="newadmin@buildvive.com"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select className="w-full p-3 border border-gray-300 rounded-md">
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Add User
                  </button>
                </div>
              </div>

              {/* User List */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium mb-4">All Users</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Role</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Last Login</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2">admin@buildvive.local</td>
                        <td className="py-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Super Admin</span>
                        </td>
                        <td className="py-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                        </td>
                        <td className="py-2">Now</td>
                        <td className="py-2">
                          <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
