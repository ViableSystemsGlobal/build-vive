"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HomepageData = {
  badge: string;
  headline: string;
  subtext: string;
  heroImage: string;
  services: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  aboutTitle: string;
  aboutDescription: string;
  stats: Array<{
    number: string;
    label: string;
  }>;
  articles: Array<{
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
  }>;
  trustedLogos: Array<{
    id: string;
    imageUrl: string;
    alt: string;
  }>;
};

function Hero({ onQuote, data }: { onQuote: () => void; data: HomepageData | null }) {
  return (
    <section id="home" className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 py-16 lg:py-24">
      <div className="flex flex-col gap-6">
        <span className="badge">{data?.badge || "#1 CONSTRUCTION COMPANY IN DENVER"}</span>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          {data?.headline || "Unparalleled construction solutions in Denver"}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl">
          {data?.subtext || "Experience excellence and durability with Ace Construction's Denver team of experts, offering innovative and unmatched residential and commercial solutions tailored to your needs."}
        </p>
        <div className="flex items-center gap-4">
          <button className="btn-primary" onClick={onQuote}>Get a quote</button>
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
          <span>Trusted by 1 Million users</span>
        </div>
      </div>
      <div className="relative">
        <div className="relative h-72 sm:h-96 lg:h-[520px] w-full overflow-hidden rounded-2xl">
          <img
            src={data?.heroImage || "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop"}
            alt="Construction crew working on a roof"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="absolute -right-6 top-6 w-64 rounded-xl bg-white p-4 shadow-xl">
          <p className="text-sm font-semibold">Our expert team</p>
          <div className="mt-3 space-y-3">
            {[
              { name: "Michael" },
              { name: "David" },
              { name: "Sarah" },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-full bg-foreground/10" />
                <span className="text-sm">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute left-8 -bottom-8 w-72 rounded-xl bg-white p-5 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-foreground/10" />
            <div className="text-sm font-semibold">Our expert team</div>
          </div>
          <p className="mt-2 text-sm text-foreground/70">
            Contact us now and we will endeavor to get back to you within 24 hours.
          </p>
          <button className="btn-primary mt-3 w-full" onClick={onQuote}>Contact us</button>
        </div>
      </div>
    </section>
  );
}

type QuoteFormData = {
  projectType?: string;
  services?: string[];
  location?: string;
  size?: string;
  status?: string;
  timeline?: string;
  budget?: string;
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
  const total = 8;

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
          {step === 2 && (
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
          {step === 3 && (
            <div className="space-y-3">
              <p className="font-medium">Where is your project located?</p>
              <input className="w-full rounded-md border border-foreground/10 p-3" placeholder="Enter city, state" value={data.location || ""} onChange={(e) => setData({ ...data, location: e.target.value })} />
            </div>
          )}
          {step === 4 && (
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
          {step === 5 && (
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
          {step === 6 && (
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
          {step === 7 && (
            <div className="space-y-3">
              <p className="font-medium">Contact details</p>
              <input className="w-full rounded-md border border-foreground/10 p-3" placeholder="Full Name" value={data.name||""} onChange={(e)=>setData({...data, name:e.target.value})} />
              <input className="w-full rounded-md border border-foreground/10 p-3" placeholder="Email Address" value={data.email||""} onChange={(e)=>setData({...data, email:e.target.value})} />
              <input className="w-full rounded-md border border-foreground/10 p-3" placeholder="Phone Number" value={data.phone||""} onChange={(e)=>setData({...data, phone:e.target.value})} />
            </div>
          )}
          {step === 8 && (
            <div className="space-y-2 text-sm">
              <p className="font-medium">Review & Submit</p>
              <pre className="whitespace-pre-wrap rounded-md bg-foreground/5 p-3">{JSON.stringify(data, null, 2)}</pre>
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
  const [open, setOpen] = useState(false);
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);

  // Load homepage data from admin system
  useEffect(() => {
    fetch("/api/admin/homepage")
      .then(res => res.json())
      .then(data => setHomepageData(data))
      .catch(error => console.error("Failed to load homepage data:", error));
  }, []);

  return (
    <div>
      <Hero onQuote={() => setOpen(true)} data={homepageData} />

      {/* Trusted logos band */}
      <section className="py-10">
        <div className="container-page">
          <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-6 text-center text-sm text-foreground/70">
            Trusted by 8,000+ happy clients since 2016.
          </div>
          <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-6 items-center opacity-80">
            {homepageData?.trustedLogos?.length ? 
              homepageData.trustedLogos.map((logo) => (
                <div key={logo.id} className="flex items-center justify-center h-10">
                  <img src={logo.imageUrl} alt={logo.alt} className="max-h-10 max-w-full opacity-70" />
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
                <div key={i} className="flex items-center justify-center h-10">
                  <Image src={src} alt="logo" width={100} height={24} className="opacity-70" />
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* About section with stats */}
      <section id="about" className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 py-20 lg:py-28">
        <div className="relative order-2 lg:order-1">
          <div className="aspect-[4/3] w-full rounded-2xl bg-[url('https://images.unsplash.com/photo-1577962917302-cd874c8f14d6?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center" />
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

      {/* Services grid (general construction) */}
      <section id="services" className="container-page py-20 lg:py-28">
        <span className="badge">OUR SERVICES</span>
        <h2 className="mt-4 text-3xl md:text-5xl font-extrabold max-w-3xl">A diverse array of comprehensive services</h2>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Discover the extensive range of services tailored to meet your every construction need across residential and commercial projects.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(homepageData?.services?.length ? homepageData.services : [
            { id: "1", title: "New builds", description: "Ground‑up residential and commercial construction from planning to completion.", icon: "🏗️" },
            { id: "2", title: "Renovation & remodeling", description: "Transform kitchens, baths, offices, and full interiors with precision.", icon: "🔨" },
            { id: "3", title: "Additions", description: "Seamless home and facility additions that blend with existing structures.", icon: "🏠" },
            { id: "4", title: "Concrete & foundations", description: "Footings, slabs, driveways, and structural concrete done right.", icon: "🧱" },
            { id: "5", title: "Framing & structural", description: "Engineered framing and structural upgrades for safety and longevity.", icon: "🏗️" },
            { id: "6", title: "Roofing & exterior", description: "Roofing, siding, windows, and exterior finishes to protect and impress.", icon: "🏠" },
          ]).map((card) => (
            <div key={card.id} className="rounded-2xl border border-foreground/10 p-6 bg-white">
              <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center text-lg">
                {card.icon || "🔧"}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quality section */}
      <section className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">
        <div className="relative order-2 lg:order-1">
          <div className="aspect-[4/3] w-full rounded-2xl bg-[url('https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute -left-6 top-6 h-24 w-24 rounded-xl border-2 border-primary" />
        </div>
        <div className="order-1 lg:order-2">
          <span className="badge">PRECISION ROOFING</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">Unmatched quality that stands out</h2>
          <p className="mt-4 text-foreground/70 max-w-prose">
            Unmatched quality that distinguishes our services as superior in the industry.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Exceptional craftsmanship",
              "Innovative techniques",
              "Commitment to customer satisfaction",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Articles preview */}
      <section id="blog" className="container-page py-20 lg:py-28">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-5xl font-extrabold">Articles & News</h2>
          <a className="btn-outline" href="#contact">Get a quote</a>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8">
          {(homepageData?.articles?.length ? homepageData.articles.slice(0, 2) : [
            {
              id: "1",
              title: "Planning a home renovation in Denver: what to know",
              excerpt: "From permits to materials, here are the essentials for a smooth renovation project in Colorado.",
              imageUrl: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1400&auto=format&fit=crop",
            },
            {
              id: "2",
              title: "Commercial build‑outs: timeline and budgeting tips",
              excerpt: "A practical overview of schedules, contingencies, and cost controls for tenant improvements.",
              imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1400&auto=format&fit=crop",
            },
          ]).map((a) => (
            <article key={a.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center rounded-2xl border border-foreground/10 overflow-hidden">
              <div className="aspect-[16/9] md:aspect-auto h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${a.imageUrl})` }} />
              <div className="p-6">
                <h3 className="text-xl font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{a.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-amber-400 py-16">
        <div className="container-page grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <h3 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Ready to take action?
          </h3>
          <div className="flex justify-start md:justify-end">
            <button className="btn-primary bg-black text-white hover:opacity-90" onClick={() => setOpen(true)}>Get a free quote</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0f1216] text-white py-16">
        <div className="container-page grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-sm border-2 border-primary" />
              <span className="font-semibold tracking-wide">Ace Construction</span>
            </div>
            <div className="mt-6 flex items-center gap-4 opacity-70 text-sm">
              <span>Instagram</span>
              <span>Twitter</span>
              <span>Facebook</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold">Essential Pages</h4>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Other Pages</h4>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              <li>Feedback</li>
              <li>Styleguide</li>
            </ul>
          </div>
        </div>
        <div className="container-page mt-12 border-t border-white/10 pt-6 text-center text-xs opacity-70">
          Copyright © {new Date().getFullYear()} Ace Construction. All Rights Reserved.
        </div>
      </footer>
      <QuoteModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}