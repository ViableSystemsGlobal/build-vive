"use client";

export default function ContactPage() {
  return (
    <div className="container-page py-20 lg:py-28">
      <h1 className="text-4xl md:text-5xl font-extrabold">Contact us</h1>
      <p className="mt-3 text-foreground/70">Have a project in Denver? Tell us about it and we’ll get back within 24 hours.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form className="space-y-4 rounded-2xl border border-foreground/10 p-6 bg-white" onSubmit={(e)=>e.preventDefault()}>
          <input className="w-full rounded-md border border-foreground/10 p-3" placeholder="Full Name" />
          <input className="w-full rounded-md border border-foreground/10 p-3" placeholder="Email Address" />
          <input className="w-full rounded-md border border-foreground/10 p-3" placeholder="Phone Number" />
          <textarea className="w-full rounded-md border border-foreground/10 p-3" rows={5} placeholder="Tell us about your project" />
          <button className="btn-primary" type="submit">Send</button>
        </form>
        <div className="rounded-2xl border border-foreground/10 p-6 bg-white">
          <h2 className="font-semibold">Ace Construction — Denver</h2>
          <p className="mt-2 text-sm text-foreground/70">1234 Blake St, Denver, CO</p>
          <p className="text-sm text-foreground/70">Open Mon–Fri, 8:00am–6:00pm</p>
        </div>
      </div>
    </div>
  );
}
