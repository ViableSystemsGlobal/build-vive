"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SmartImage from "./components/SmartImage";
import { useQuote } from "./components/QuoteProvider";

type HomepageData = {
  badge: string;
  headline: string;
  subtext: string;
  heroImage: string;
  trustedUsers: string;
  footerLogoUrl?: string;
  footerCompanyName: string;
  footerDescription: string;
  footerAddress: string;
  footerPhone: string;
  footerEmail: string;
  services: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    image?: string;
  }>;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
  stats: Array<{
    number: string;
    label: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    badge: string;
    image: string;
    features: Array<string>;
  }>;
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
  trustedLogos: Array<{
    id: string;
    imageUrl: string;
    alt: string;
  }>;
};

function Hero({ data }: { data: HomepageData | null }) {
  const { openQuote } = useQuote();
  return (
    <section id="home" className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 py-16 lg:py-24">
      <div className="flex flex-col gap-6">
        <span className="badge">{data?.badge || "#1 CONSTRUCTION COMPANY IN DENVER"}</span>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          {data?.headline || "Unparalleled construction solutions in Denver"}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl">
          {data?.subtext || "Experience excellence and durability with BuildVive Renovations' Denver team of experts, offering innovative and unmatched residential and commercial solutions tailored to your needs."}
        </p>
        <div className="flex items-center gap-4">
          <button className="btn-primary" onClick={openQuote}>Get a Free Quote in 30 mins</button>
          <a className="btn-outline" href="#services">Our services</a>
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm text-foreground/70">
          <div className="flex -space-x-2">
            {[
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=256&auto=format&fit=crop",
            ].map((url, i) => (
              <span key={i} className="h-8 w-8 rounded-full ring-2 ring-white bg-center bg-cover" style={{ backgroundImage: `url(${url})` }} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="h-3 w-3 rounded-full bg-amber-400" />
            ))}
          </div>
          <span>{data?.trustedUsers || "Trusted by 1 Million users"}</span>
        </div>
      </div>
      <div className="relative">
        <div className="relative h-72 sm:h-96 lg:h-[520px] w-full overflow-hidden rounded-2xl">
          <Image
            src={data?.heroImage || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop"}
            alt="Construction crew working on a roof"
            fill
            className="object-cover"
            priority
          />
        </div>


      </div>
    </section>
  );
}

type QuoteFormData = {
  urgency?: string;
  projectType?: string;
  services?: string[];
  location?: string;
  size?: string;
  timeline?: string;
  budget?: string;
  images?: string;
  comments?: string;
  name?: string;
  email?: string;
  phone?: string;
};

const SERVICE_OPTIONS = [
  "Foundation & Structural Work",
  "Electrical Installation",
  "Plumbing Installation",
  "HVAC Systems",
  "Insulation & Drywall",
  "Flooring Installation",
  "Kitchen Remodeling",
  "Bathroom Remodeling",
  "Exterior Siding",
  "Window Installation",
  "Door Installation",
  "Painting & Finishing",
  "Concrete & Masonry",
  "Landscaping & Outdoor",
];

function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuoteFormData>({});
  const total = 10;

  const next = () => setStep(s => Math.min(s + 1, total));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const submit = async () => {
    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("Quote request submitted successfully!");
      onClose();
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
                <label key={s} className="flex items-center gap-3 text-sm">
                  <input type="radio" name="projectType" checked={data.projectType === s} onChange={() => setData({ ...data, projectType: s })} />
                  {s}
                </label>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <p className="font-medium">Which services do you need? (Select all that apply)</p>
              {SERVICE_OPTIONS.map((s) => (
                <label key={s} className="flex items-center gap-3 text-sm">
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
                  {s}
                </label>
              ))}
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <p className="font-medium">Where is your project located?</p>
              <input className="w-full rounded-md border border-foreground/10 p-3" placeholder="Enter city, state" value={data.location || ""} onChange={(e) => setData({ ...data, location: e.target.value })} />
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
              <textarea 
                className="w-full rounded-md border border-foreground/10 p-3 h-24" 
                placeholder="Describe your images or paste image URLs here. You can also mention if you'll send images separately." 
                value={data.images || ""} 
                onChange={(e) => setData({...data, images: e.target.value})} 
              />
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
                {data.location && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Location:</span> {data.location}
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
                {data.images && (
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <span className="font-medium text-primary">Project Images:</span>
                    <div className="mt-1 text-sm text-foreground/70">{data.images}</div>
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

export default function Home() {
  const { openQuote } = useQuote();
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);
  const [currentRoofingProject, setCurrentRoofingProject] = useState(0);
  const [currentService, setCurrentService] = useState(0);

  // Load homepage data from admin system
  useEffect(() => {
    fetch("/api/admin/homepage")
      .then(res => res.json())
      .then(data => {
        setHomepageData(data);
        setIsDataLoaded(true);
        // Note: PageLoader now fetches data directly from API instead of using events
      })
      .catch(error => {
        console.error("Failed to load homepage data:", error);
        setIsDataLoaded(true); // Still show page even if data fails to load
        // Note: PageLoader now fetches data directly from API instead of using events
      });
  }, []);

  // Auto-rotate roofing projects every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoofingProject((prev) => (prev === 4 ? 0 : prev + 1));
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate services every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService((prev) => (prev === 5 ? 0 : prev + 1));
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);

  // Don't render until data is loaded
  if (!isDataLoaded) {
    return null; // This will be handled by the PageLoader
  }

  // Generate comprehensive structured data for maximum SEO impact
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": homepageData?.footerCompanyName || "BuildVive Renovations",
    "alternateName": ["BuildVive", "BuildVive Construction", "Denver Construction Company"],
    "description": homepageData?.aboutDescription || "Denver's premier construction and renovation company specializing in residential and commercial projects. Licensed, insured, and trusted by 8,000+ Colorado homeowners.",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://buildvive.com",
    "telephone": homepageData?.footerPhone || "(555) 123-4567",
    "email": homepageData?.footerEmail || "info@buildvive.com",
    "foundingDate": "2016",
    "numberOfEmployees": "25-50",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": homepageData?.footerAddress || "123 Construction Way",
      "addressLocality": "Denver",
      "addressRegion": "CO",
      "postalCode": "80202",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "39.7392",
      "longitude": "-104.9903"
    },
    "openingHours": ["Mo-Fr 08:00-17:00", "Sa 09:00-15:00"],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Check", "Credit Card", "Financing"],
    "currenciesAccepted": "USD",
    "image": homepageData?.heroImage || "",
    "logo": homepageData?.footerLogoUrl || "",
    "sameAs": [
      "https://www.facebook.com/buildvive",
      "https://www.instagram.com/buildvive",
      "https://www.linkedin.com/company/buildvive",
      "https://www.yelp.com/biz/buildvive-renovations-denver"
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "39.7392",
        "longitude": "-104.9903"
      },
      "geoRadius": "50000"
    },
    "areaServed": [
      "Denver, CO",
      "Aurora, CO", 
      "Lakewood, CO",
      "Thornton, CO",
      "Westminster, CO",
      "Arvada, CO",
      "Centennial, CO",
      "Boulder, CO"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Construction Services",
      "itemListElement": (homepageData?.services || []).map((service, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.title,
          "description": service.description,
          "provider": {
            "@type": "LocalBusiness",
            "name": homepageData?.footerCompanyName || "BuildVive Renovations"
          }
        },
        "position": index + 1,
        "availability": "https://schema.org/InStock"
      }))
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah Johnson"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Exceptional work on our kitchen renovation. Professional, on-time, and exceeded expectations."
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Free Consultation",
          "description": "Complimentary project consultation and estimate"
        },
        "price": "0",
        "priceCurrency": "USD"
      }
    ]
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="pt-8" data-main-content>
        <div id="home">
          <Hero data={homepageData} />
        </div>

      {/* Trusted logos band */}
      <section className="py-10">
        <div className="container-page">
          <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-6 text-center text-sm text-foreground/70">
            Trusted by 8,000+ happy clients since 2016.
          </div>
          <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-6 items-center opacity-80">
            {homepageData?.trustedLogos?.length ? 
              homepageData.trustedLogos.map((logo) => (
                <div key={logo.id} className="flex items-center justify-center h-16">
                  <SmartImage 
                    src={logo.imageUrl} 
                    alt={logo.alt} 
                    width={120} 
                    height={60} 
                    className="max-h-16 max-w-full opacity-70 object-contain" 
                  />
                </div>
              )) :
              [
                "/vercel.svg",
                "/next.svg",
                "/globe.svg",
                "/window.svg",
                "/file.svg",
                "/next.svg",
              ].map((src, i) => (
                <div key={i} className="flex items-center justify-center h-16">
                  <Image src={src} alt="logo" width={120} height={32} className="opacity-70" />
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* About section with stats */}
      <section id="about" className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 py-20 lg:py-28">
        <div className="relative order-2 lg:order-1">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden">
            <SmartImage 
              src={homepageData?.aboutImage || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop"}
              alt="Construction site with heavy machinery and workers"
              width={600}
              height={450}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-xl border-2 border-primary" />
        </div>
        <div className="order-1 lg:order-2">
          <span className="badge">ABOUT US</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
            {homepageData?.aboutTitle || "A team of dependable and seasoned builders"}
          </h2>
          <p className="mt-4 text-foreground/70 max-w-prose">
            {homepageData?.aboutDescription || "Dependable and seasoned contractors delivering top‑quality construction with a commitment to excellence and customer satisfaction."}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6">
            {(homepageData?.stats?.length ? homepageData.stats : [
              { number: "+350", label: "Executed projects" },
              { number: "12Y", label: "Experience" },
              { number: "+550", label: "Satisfied clients" },
            ]).map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-primary">{s.number}</div>
                <div className="mt-1 text-xs text-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Slider */}
      <section id="services" className="container-page py-20 lg:py-28">
        <div className="text-center mb-16">
        <span className="badge">OUR SERVICES</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">A diverse array of comprehensive services</h2>
          <p className="mt-4 max-w-2xl mx-auto text-foreground/70">
          Discover the extensive range of services tailored to meet your every construction need across residential and commercial projects.
        </p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentService * 100}%)` }}>
          {(homepageData?.services?.length ? homepageData.services : [
              { id: "1", title: "New builds", description: "Ground‑up residential and commercial construction from planning to completion.", icon: "🏗️", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop" },
              { id: "2", title: "Renovation & remodeling", description: "Transform kitchens, baths, offices, and full interiors with precision.", icon: "🔨", image: "https://images.unsplash.com/photo-1577962917302-cd874c8f14d6?q=80&w=1400&auto=format&fit=crop" },
              { id: "3", title: "Additions", description: "Seamless home and facility additions that blend with existing structures.", icon: "🏠", image: "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop" },
              { id: "4", title: "Concrete & foundations", description: "Footings, slabs, driveways, and structural concrete done right.", icon: "🧱", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1400&auto=format&fit=crop" },
              { id: "5", title: "Framing & structural", description: "Engineered framing and structural upgrades for safety and longevity.", icon: "🏗️", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1400&auto=format&fit=crop" },
              { id: "6", title: "Roofing & exterior", description: "Roofing, siding, windows, and exterior finishes to protect and impress.", icon: "🏠", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop" },
            ]).map((service, index) => (
              <div key={service.id} className="w-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 lg:order-1">
                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden">
                    <SmartImage 
                      src={service.image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop"}
                      alt={service.title}
                      width={600}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -left-6 top-6 h-24 w-24 rounded-xl border-2 border-primary" />
                </div>
                <div className="order-1 lg:order-2">
                  <span className="badge">{service.title.toUpperCase()}</span>
                  <h3 className="mt-4 text-3xl md:text-5xl font-extrabold">{service.title}</h3>
                  <p className="mt-4 text-foreground/70 max-w-prose">
                    {service.description}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">
                      {service.icon}
                    </div>
                    <div className="text-sm text-foreground/70">
                      <div className="font-semibold">Service #{service.id}</div>
                      <div>Professional grade</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-12 space-x-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentService(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentService === index ? 'bg-primary' : 'bg-foreground/20'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button
            onClick={() => setCurrentService((prev) => (prev === 0 ? 5 : prev - 1))}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentService((prev) => (prev === 5 ? 0 : prev + 1))}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          >
            →
          </button>
        </div>
      </section>

      {/* Construction Projects Slider */}
      <section id="projects" className="container-page py-20 lg:py-28">
        <div className="text-center mb-16">
          <span className="badge">OUR PROJECTS</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">Construction Excellence Portfolio</h2>
          <p className="mt-4 max-w-2xl mx-auto text-foreground/70">
            Discover our diverse portfolio of construction projects that showcase our expertise across residential, commercial, and industrial sectors.
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentRoofingProject * 100}%)` }}>
            {(homepageData?.projects?.length ? homepageData.projects : [
              {
                image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1400&auto=format&fit=crop",
                badge: "RESIDENTIAL",
                title: "Modern Home Construction",
                description: "Complete custom home build with premium materials and energy-efficient design.",
                features: ["Custom design", "Energy efficient", "Premium materials"]
              },
              {
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop",
                badge: "COMMERCIAL",
                title: "Office Complex Development",
                description: "Multi-story office building with modern amenities and sustainable features.",
                features: ["Modern design", "Sustainable features", "Premium amenities"]
              },
              {
                image: "https://images.unsplash.com/photo-1577962917302-cd874c8f14d6?q=80&w=1400&auto=format&fit=crop",
                badge: "RENOVATION",
                title: "Historic Building Restoration",
                description: "Careful restoration preserving architectural integrity while modernizing systems.",
                features: ["Heritage preservation", "Modern systems", "Historical accuracy"]
              },
              {
                image: "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop",
                badge: "INDUSTRIAL",
                title: "Warehouse & Factory Construction",
                description: "Large-scale industrial facilities with advanced infrastructure and safety systems.",
                features: ["Industrial grade", "Advanced infrastructure", "Safety systems"]
              },
              {
                image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1400&auto=format&fit=crop",
                badge: "SPECIALTY",
                title: "Mixed-Use Development",
                description: "Innovative mixed-use project combining residential, retail, and office spaces.",
                features: ["Mixed-use design", "Innovative layout", "Community focused"]
              }
            ]).map((project, index) => (
              <div key={index} className="w-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 lg:order-1">
                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden">
                    <SmartImage 
                      src={project.image}
                      alt={project.title}
                      width={600}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  </div>
          <div className="absolute -left-6 top-6 h-24 w-24 rounded-xl border-2 border-primary" />
        </div>
        <div className="order-1 lg:order-2">
                  <span className="badge">{project.badge}</span>
                  <h3 className="mt-4 text-3xl md:text-5xl font-extrabold">{project.title}</h3>
          <p className="mt-4 text-foreground/70 max-w-prose">
                    {project.description}
          </p>
          <ul className="mt-6 space-y-3 text-sm">
                    {project.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                        {feature}
              </li>
            ))}
          </ul>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-12 space-x-3">
            {Array.from({ length: (homepageData?.projects?.length || 5) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentRoofingProject(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentRoofingProject === index ? 'bg-primary' : 'bg-foreground/20'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button
            onClick={() => setCurrentRoofingProject((prev) => (prev === 0 ? (homepageData?.projects?.length || 5) - 1 : prev - 1))}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentRoofingProject((prev) => (prev === (homepageData?.projects?.length || 5) - 1 ? 0 : prev + 1))}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          >
            →
          </button>
        </div>
      </section>

      {/* Articles preview */}
      <section id="blog" className="container-page py-20 lg:py-28">
        <div className="text-center mb-16">
          <span className="badge">INSIGHTS & EXPERTISE</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">Construction Insights & Industry News</h2>
          <p className="mt-4 max-w-2xl mx-auto text-foreground/70">
            Stay informed with expert insights, industry trends, and practical tips from our construction professionals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(homepageData?.articles?.length ? homepageData.articles.slice(0, 3) : []).map((article) => (
            <article key={article.id} className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] w-full">
                  <Image 
                    src={article.imageUrl}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {article.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-white">
                      FEATURED
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-foreground">
                    {article.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-foreground/60 mb-3">
                  <span>📅</span>
                  <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
                <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">AC</span>
                    </div>
                    <span className="text-sm font-medium">{article.author}</span>
                  </div>
                  <a 
                    href={`/blog/${article.slug}`}
                    className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </article>
          ))}

        </div>
        
        {homepageData?.articles && homepageData.articles.length > 3 && (
          <div className="text-center mt-12">
            <a 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              View All Articles
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 bg-foreground/5 rounded-2xl px-8 py-4 border border-foreground/10">
          <span className="text-2xl">🔨</span>
          <div className="text-left">
            <p className="font-semibold">Have a Job You Need Done?</p>
            <p className="text-sm text-foreground/70">We will match any quote you have</p>
          </div>
          <button className="btn-primary ml-4" onClick={openQuote}>Get a Quote in 30 mins</button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer id="contact" className="bg-[#0f1216] text-white py-16 mt-4">
        <div className="container-page grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2">
              {homepageData?.footerLogoUrl ? (
                <SmartImage 
                  src={homepageData.footerLogoUrl} 
                  alt="Logo" 
                  width={24} 
                  height={24} 
                  className="h-6 w-6 rounded-sm"
                />
              ) : (
              <div className="h-6 w-6 rounded-sm border-2 border-primary" />
              )}
              <span className="font-semibold tracking-wide">
                {homepageData?.footerCompanyName || "BuildVive Renovations"}
              </span>
            </div>
            <p className="mt-4 text-sm opacity-80 max-w-sm">
              {homepageData?.footerDescription || "Building excellence in Denver since 2010."}
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
              <li>{homepageData?.footerAddress || "123 Construction Way, Denver, CO 80202"}</li>
              <li>{homepageData?.footerPhone || "(555) 123-4567"}</li>
              <li>{homepageData?.footerEmail || "info@buildvive.com"}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="/admin" className="hover:text-primary transition-colors">Admin Panel</a></li>
            </ul>
          </div>
        </div>
        <div className="container-page mt-12 border-t border-white/10 pt-6 text-center text-xs opacity-70">
          Copyright © {new Date().getFullYear()} {homepageData?.footerCompanyName || "BuildVive Renovations"}. All Rights Reserved.
        </div>
      </footer>
      
    </div>
    </>
  );
}