import Image from "next/image";

type Project = {
  title: string;
  badge: string;
  image: string;
  description: string;
  features: string[];
};

const PROJECTS: Record<string, Project> = {
  "modern-family-home": {
    title: "Modern Family Home",
    badge: "RESIDENTIAL",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1400&auto=format&fit=crop",
    description:
      "A stunning contemporary residence featuring open-concept design, premium finishes, and sustainable building practices.",
    features: ["Open floor plan", "Energy efficient", "Smart home technology"],
  },
  "office-complex": {
    title: "Office Complex",
    badge: "COMMERCIAL",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop",
    description:
      "State-of-the-art commercial building with modern amenities and innovative architectural design.",
    features: ["Modern amenities", "Innovative design", "Premium finishes"],
  },
  "historic-building-restoration": {
    title: "Historic Building Restoration",
    badge: "RENOVATION",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c8f14d6?q=80&w=1400&auto=format&fit=crop",
    description:
      "Careful restoration of a century-old building while preserving its architectural heritage.",
    features: ["Heritage preservation", "Modern upgrades", "Historical accuracy"],
  },
  "manufacturing-facility": {
    title: "Manufacturing Facility",
    badge: "INDUSTRIAL",
    image: "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop",
    description:
      "Large-scale industrial construction project with advanced infrastructure and safety systems.",
    features: ["Advanced infrastructure", "Safety systems", "Efficient layout"],
  },
};

export default async function ProjectDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS[slug];

  if (!project) {
    return (
      <div className="container-page py-24">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="mt-2 text-foreground/70">The project you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container-page py-20 lg:py-28">
      <span className="badge">{project.badge}</span>
      <h1 className="mt-4 text-4xl md:text-6xl font-extrabold">{project.title}</h1>
      <p className="mt-4 max-w-2xl text-foreground/70">{project.description}</p>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden">
            <Image 
              src={project.image} 
              alt={project.title} 
              width={600}
              height={450}
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-xl border-2 border-primary" />
        </div>
        <div className="order-1 lg:order-2">
          <ul className="space-y-3 text-sm">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <a href="/" className="btn-outline">Back to home</a>
          </div>
        </div>
      </div>
    </div>
  );
}


