"use client";
import { useState } from "react";
import { useQuote } from "./QuoteProvider";

type QuoteFormData = {
  urgency?: string;
  projectType?: string;
  services?: string[];
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  size?: string;
  timeline?: string;
  budget?: string;
  images?: File[];
  comments?: string;
  name?: string;
  email?: string;
  phone?: string;
};

// Simplified services for all project types
const SIMPLE_SERVICES = [
  "Kitchen Remodeling",
  "Bathroom Remodeling", 
  "Flooring",
  "Painting",
  "Electrical Work",
  "Plumbing",
  "HVAC",
  "Windows & Doors",
  "Roofing",
  "Foundation & Structural",
  "Exterior Work",
  "Other"
];


export function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuoteFormData>({});
  const total = 10;
  const { setQuoteSubmitted, setCurrentQuoteId } = useQuote();

  const next = () => setStep(s => Math.min(s + 1, total));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const submit = async () => {
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          // Handle file uploads
          value.forEach((file, index) => {
            formData.append(`images`, file);
          });
        } else if (value !== undefined && value !== null && key !== 'images') {
          formData.append(key, String(value));
        }
      });
      
      const response = await fetch("/api/quote", {
        method: "POST",
        body: formData, // Send as FormData instead of JSON
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Set the quote ID in context for chatbot to use
        if (result.quoteId) {
          setCurrentQuoteId(result.quoteId);
        }
        
        // Mark quote as submitted
        setQuoteSubmitted(true);
        
        // Show success toast
        if (typeof window !== 'undefined') {
          // Create and show toast
          const toast = document.createElement('div');
          toast.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl text-center';
          toast.innerHTML = `
            <div class="text-2xl mb-2">✅</div>
            <div class="font-bold text-lg">Thank you for your quote request!</div>
            <div class="text-sm opacity-90">We'll get back to you within 30 minutes</div>
          `;
          document.body.appendChild(toast);
          
          // Remove toast after 3 seconds
          setTimeout(() => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 3000);
        }
        
        // Close the quote modal
        onClose();
        
        // Trigger chatbot to open after quote submission
        if (typeof window !== 'undefined') {
          console.log('Dispatching quoteSubmitted event');
          // Dispatch custom event to trigger chatbot
          window.dispatchEvent(new CustomEvent('quoteSubmitted'));
          console.log('Event dispatched');
        }
      } else {
        throw new Error('Failed to submit quote');
      }
    } catch (error) {
      alert("Failed to submit quote request");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Get Your Quote</h2>
          <div className="text-sm text-foreground/70">Step {step} of {total}</div>
        </div>
        <div className="mb-4 h-2 rounded-full bg-foreground/10">
          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Is this an emergency or non-emergency project?</p>
                <p className="text-sm text-foreground/70 mb-4">Please select the urgency level of your project</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-amber-800 font-medium">
                    ⚠️ Important: Whether emergency or non-emergency, you will receive your quote within 30 minutes!
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {["Emergency - Need immediate attention", "Non-emergency - Can wait for scheduled work"].map((s) => (
                  <label key={s} className="flex items-center gap-3 text-sm p-3 border border-foreground/10 rounded-lg hover:bg-foreground/5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="urgency" 
                      checked={data.urgency === s} 
                      onChange={() => setData({ ...data, urgency: s })} 
                    />
                    <span className="font-medium">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <p className="font-medium">What type of project do you have?</p>
              {["New Construction","Renovation/Remodel","Addition","Repair/Maintenance","Other"].map((s) => (
                <label key={s} className="flex items-center gap-3 text-sm p-3 border border-foreground/10 rounded-lg hover:bg-foreground/5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="projectType" 
                    checked={data.projectType === s} 
                    onChange={() => setData({ ...data, projectType: s })} 
                  />
                  <span className="font-medium">{s}</span>
                </label>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <p className="font-medium">Which services do you need? (Select all that apply)</p>
              <div className="grid grid-cols-2 gap-3">
                {SIMPLE_SERVICES.map((s) => (
                  <label key={s} className="flex items-center gap-3 text-sm p-3 border border-foreground/10 rounded-lg hover:bg-foreground/5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.services?.includes(s) || false} 
                      onChange={(e) => {
                        const services = data.services || [];
                        if (e.target.checked) {
                          setData({ ...data, services: [...services, s] });
                        } else {
                          setData({ ...data, services: services.filter(x => x !== s) });
                        }
                      }} 
                    />
                    <span className="font-medium">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <p className="font-medium">What is your project address?</p>
              <input 
                className="w-full rounded-md border border-foreground/10 p-3" 
                placeholder="Street Address" 
                value={data.address || ""} 
                onChange={(e) => setData({ ...data, address: e.target.value })} 
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  className="w-full rounded-md border border-foreground/10 p-3" 
                  placeholder="City" 
                  value={data.city || ""} 
                  onChange={(e) => setData({ ...data, city: e.target.value })} 
                />
                <input 
                  className="w-full rounded-md border border-foreground/10 p-3" 
                  placeholder="State" 
                  value={data.state || ""} 
                  onChange={(e) => setData({ ...data, state: e.target.value })} 
                />
                <input 
                  className="w-full rounded-md border border-foreground/10 p-3" 
                  placeholder="ZIP Code" 
                  value={data.zipCode || ""} 
                  onChange={(e) => setData({ ...data, zipCode: e.target.value })} 
                />
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-3">
              <p className="font-medium">What is the approximate size of your project?</p>
              {["Small (<1,000 sq ft)","Medium (1,000-3,000 sq ft)","Large (3,000-5,000 sq ft)","Extra Large (>5,000 sq ft)"].map((s) => (
                <label key={s} className="flex items-center gap-3 text-sm">
                  <input type="radio" name="size" checked={data.size === s} onChange={() => setData({ ...data, size: s })} />
                  {s}
                </label>
              ))}
            </div>
          )}
          {step === 6 && (
            <div className="space-y-3">
              <p className="font-medium">When would you like to start?</p>
              {["Immediately","Within 1 month","1–3 months","3–6 months","Flexible"].map((s)=> (
                <label key={s} className="flex items-center gap-3 text-sm">
                  <input type="radio" name="timeline" checked={data.timeline===s} onChange={()=>setData({...data, timeline:s})} />
                  {s}
                </label>
              ))}
            </div>
          )}
          {step === 7 && (
            <div className="space-y-3">
              <p className="font-medium">What is your budget range?</p>
              {["<$50,000","$50,000–$100,000","$100,000–$250,000","$250,000–$500,000","$500,000+"].map((s)=> (
                <label key={s} className="flex items-center gap-3 text-sm">
                  <input type="radio" name="budget" checked={data.budget===s} onChange={()=>setData({...data, budget:s})} />
                  {s}
                </label>
              ))}
            </div>
          )}
          {step === 8 && (
            <div className="space-y-3">
              <p className="font-medium">Do you have any project images to share?</p>
              <p className="text-sm text-foreground/70 mb-3">Upload photos, sketches, or reference images to help us better understand your project</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full rounded-md border border-foreground/10 p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setData({...data, images: files});
                }}
              />
              {data.images && data.images.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-foreground/70 mb-2">Selected images:</p>
                  <div className="space-y-2">
                    {data.images.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-foreground/70">
                        <span>📷</span>
                        <span>{file.name}</span>
                        <span className="text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {step === 9 && (
            <div className="space-y-3">
              <p className="font-medium">Contact details</p>
              <input className="w-full rounded-md border border-foreground/10 p-3" placeholder="Full Name" value={data.name||""} onChange={(e)=>setData({...data, name:e.target.value})} />
              <input className="w-full rounded-md border border-foreground/10 p-3" placeholder="Email Address" value={data.email||""} onChange={(e)=>setData({...data, email:e.target.value})} />
              <input className="w-full rounded-md border border-foreground/10 p-3" placeholder="Phone Number" value={data.phone||""} onChange={(e)=>setData({...data, phone:e.target.value})} />
              <div className="mt-4">
                <p className="font-medium mb-2">Any additional comments or special requirements?</p>
                <textarea 
                  className="w-full rounded-md border border-foreground/10 p-3 h-20" 
                  placeholder="Share any additional details, special requirements, or questions you have about your project..." 
                  value={data.comments || ""} 
                  onChange={(e) => setData({...data, comments: e.target.value})} 
                />
              </div>
            </div>
          )}
          {step === 10 && (
            <div className="space-y-4">
              <p className="font-medium text-lg text-center">Review Your Quote Request</p>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {data.urgency && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Urgency:</span> {data.urgency}
                  </div>
                )}
                {data.projectType && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Project Type:</span> {data.projectType}
                  </div>
                )}
                {data.services && data.services.length > 0 && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Services Needed:</span>
                    <div className="mt-1 space-y-1">
                      {data.services.map((service, index) => (
                        <div key={index} className="text-sm">• {service}</div>
                      ))}
                    </div>
                  </div>
                )}
                {(data.address || data.city || data.state || data.zipCode) && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Project Address:</span>
                    <div className="mt-1 text-sm text-foreground/70">
                      {data.address && <div>{data.address}</div>}
                      {(data.city || data.state || data.zipCode) && (
                        <div>{[data.city, data.state, data.zipCode].filter(Boolean).join(', ')}</div>
                      )}
                    </div>
                  </div>
                )}
                {data.size && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Project Size:</span> {data.size}
                  </div>
                )}
                {data.timeline && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Timeline:</span> {data.timeline}
                  </div>
                )}
                {data.budget && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Budget Range:</span> {data.budget}
                  </div>
                )}
                {data.images && data.images.length > 0 && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Project Images:</span>
                    <div className="mt-1 space-y-1">
                      {data.images.map((file, index) => (
                        <div key={index} className="text-sm text-foreground/70">
                          📷 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.comments && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Additional Comments:</span>
                    <div className="mt-1 text-sm text-foreground/70">{data.comments}</div>
                  </div>
                )}
                {data.name && data.email && data.phone && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Contact Information:</span>
                    <div className="mt-1 space-y-1 text-sm">
                      <div>• Name: {data.name}</div>
                      <div>• Email: {data.email}</div>
                      <div>• Phone: {data.phone}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-sm text-green-800 font-medium">
                  ✅ Ready to submit! You'll receive your quote within 30 minutes.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button className="btn-outline" onClick={onClose}>Close</button>
          <div className="flex items-center gap-3">
            <button className="btn-outline" onClick={prev} disabled={step===1}>Back</button>
            {step < total ? (
              <button className="btn-primary" onClick={next}>Next</button>
            ) : (
              <button className="btn-primary" onClick={submit}>Submit & Get My Quote</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
