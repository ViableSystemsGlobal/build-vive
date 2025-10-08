export default function AboutPage() {
  return (
    <section className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">
      <div className="relative order-2 lg:order-1">
        <div className="aspect-[4/3] w-full rounded-2xl bg-[url('https://images.unsplash.com/photo-1577962917302-cd874c8f14d6?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-xl border-2 border-primary" />
      </div>
      <div className="order-1 lg:order-2">
        <span className="badge">SKILLED CONSTRUCTION</span>
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-balance">Expert construction services at your doorstep</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Our dedicated team in Denver is ready to handle all your construction needs with precision and care, ensuring
          quality craftsmanship and exceptional customer service from start to finish.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-6">
          {[{v:"+356",l:"Executed projects"},{v:"12Y",l:"Experience"},{v:"+556",l:"Satisfied clients"}].map(s=> (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-extrabold text-primary">{s.v}</div>
              <div className="mt-1 text-xs text-foreground/70">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
