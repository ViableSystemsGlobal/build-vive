export default function BlogPage() {
  const posts = [
    { title: "How to plan a home addition in Denver", date: "2024-11-12" },
    { title: "Commercial tenant improvements: a quick guide", date: "2024-10-01" },
    { title: "Choosing materials that last in Colorado's climate", date: "2024-08-20" },
  ];
  return (
    <div className="container-page py-20 lg:py-28">
      <h1 className="text-4xl md:text-5xl font-extrabold">Articles & News</h1>
      <ul className="mt-8 space-y-4">
        {posts.map((p) => (
          <li key={p.title} className="rounded-2xl border border-foreground/10 p-6 bg-white">
            <div className="text-sm text-foreground/60">{new Date(p.date).toLocaleDateString()}</div>
            <div className="mt-1 font-semibold">{p.title}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
