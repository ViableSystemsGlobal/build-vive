"use client";
import { useEffect, useState } from "react";

type Page = { slug: string; title: string; description: string };
type Section = { id?: string; key: string; data: Record<string, unknown> };
type Media = { id?: string; url: string; alt: string; sectionKey?: string };

export default function PagesCMS() {
  const [pages, setPages] = useState<Page[]>([]);
  const [current, setCurrent] = useState<Page | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [media, setMedia] = useState<Media[]>([]);

  async function load() {
    const res = await fetch("/api/cms/pages");
    const data = await res.json();
    setPages(data);
  }
  useEffect(() => { load(); }, []);

  async function select(slug: string) {
    const res = await fetch(`/api/cms/pages/${slug}`);
    const data = await res.json();
    setCurrent({ slug: data.slug, title: data.title, description: data.description });
    setSections(data.sections || []);
    setMedia(data.media || []);
  }

  async function savePage() {
    if (!current) return;
    await fetch(`/api/cms/pages/${current.slug}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...current, sections, media }) });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input className="rounded-md border border-foreground/10 p-3" placeholder="New page slug (e.g. home)"
               onKeyDown={async (e)=>{ if(e.key==='Enter'){ await fetch('/api/cms/pages',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slug: (e.target as HTMLInputElement).value, title: 'New Page', description: '' })}); (e.target as HTMLInputElement).value=''; await load(); } }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 space-y-2">
          {pages.map(p => (
            <button key={p.slug} className={`w-full text-left rounded-md border px-3 py-2 ${current?.slug===p.slug?'border-primary':'border-foreground/10'}`} onClick={()=>select(p.slug)}>
              {p.slug}
            </button>
          ))}
        </aside>
        <main className="md:col-span-3 space-y-6">
          {current ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="rounded-md border border-foreground/10 p-3" value={current.title} onChange={(e)=>setCurrent({...current, title: e.target.value})} />
                <input className="rounded-md border border-foreground/10 p-3" value={current.description} onChange={(e)=>setCurrent({...current, description: e.target.value})} />
              </div>
              <div>
                <div className="mb-2 font-semibold">Sections</div>
                <div className="space-y-2">
                  {sections.map((s, i) => (
                    <div key={s.id ?? i} className="rounded-md border border-foreground/10 p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input className="rounded-md border border-foreground/10 p-2" placeholder="key" value={s.key} onChange={(e)=>{ const arr=[...sections]; arr[i]={...s,key:e.target.value}; setSections(arr); }} />
                        <input className="rounded-md border border-foreground/10 p-2 md:col-span-2" placeholder='data (JSON)' value={JSON.stringify(s.data ?? {})} onChange={(e)=>{ const arr=[...sections]; let parsed: Record<string, unknown> = {}; try{ parsed = JSON.parse(e.target.value) as Record<string, unknown>; } catch { parsed = {}; } arr[i] = { ...s, data: parsed }; setSections(arr); }} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-outline mt-2" onClick={()=> setSections([...sections, { key: '', data: {} }])}>Add section</button>
              </div>
              <div>
                <div className="mb-2 font-semibold">Images</div>
                <div className="space-y-2">
                  {media.map((m, i) => (
                    <div key={m.id ?? i} className="rounded-md border border-foreground/10 p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input className="rounded-md border border-foreground/10 p-2" placeholder="url" value={m.url} onChange={(e)=>{ const arr=[...media]; arr[i]={...m,url:e.target.value}; setMedia(arr); }} />
                        <input className="rounded-md border border-foreground/10 p-2" placeholder="alt" value={m.alt} onChange={(e)=>{ const arr=[...media]; arr[i]={...m,alt:e.target.value}; setMedia(arr); }} />
                        <input className="rounded-md border border-foreground/10 p-2" placeholder="sectionKey" value={m.sectionKey ?? ''} onChange={(e)=>{ const arr=[...media]; arr[i]={...m,sectionKey:e.target.value}; setMedia(arr); }} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-outline mt-2" onClick={()=> setMedia([...media, { url: '', alt: '', sectionKey: '' }])}>Add image</button>
              </div>
              <button className="btn-primary" onClick={savePage}>Save page</button>
            </div>
          ) : (
            <div>Select a page from the left or create a new one.</div>
          )}
        </main>
      </div>
    </div>
  );
}

