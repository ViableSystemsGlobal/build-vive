import Link from "next/link";
import Image from "next/image";
import { Footer } from "../components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Blog - BuildVive Renovations | Denver Construction Insights",
  description: "Expert construction insights, industry trends, and practical tips from Denver's premier construction company. Stay informed with BuildVive Renovations' professional blog.",
  keywords: "Denver construction blog, construction insights, building tips, renovation advice, construction industry news, BuildVive Renovations blog",
  openGraph: {
    title: "Construction Blog - BuildVive Renovations | Denver Construction Insights",
    description: "Expert construction insights, industry trends, and practical tips from Denver's premier construction company.",
    type: "website",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Construction Blog - BuildVive Renovations | Denver Construction Insights",
    description: "Expert construction insights, industry trends, and practical tips from Denver's premier construction company.",
  },
};

type Article = {
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
};

async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/homepage`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      return data.articles || [];
    }
  } catch (error) {
    console.error('Failed to load articles:', error);
  }
  return [];
}

export default async function BlogPage() {
  const articles = await getArticles();

  // Generate structured data for blog
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "BuildVive Renovations Construction Blog",
    "description": "Expert construction insights, industry trends, and practical tips from Denver's premier construction company.",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://buildvive.com'}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "BuildVive Renovations",
      "url": process.env.NEXT_PUBLIC_BASE_URL || "https://buildvive.com"
    },
    "blogPost": articles.map(article => ({
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.excerpt,
      "image": article.imageUrl,
      "author": {
        "@type": "Person",
        "name": article.author
      },
      "datePublished": article.publishDate,
      "dateModified": article.publishDate,
      "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://buildvive.com'}/blog/${article.slug}`,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://buildvive.com'}/blog/${article.slug}`
      }
    }))
  };

  return (
    <>
      {/* Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="pt-20">
        <div className="container-page py-20">
        <div className="text-center mb-16">
          <span className="badge">INSIGHTS & EXPERTISE</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold">Construction Insights & Industry News</h1>
          <p className="mt-4 max-w-2xl mx-auto text-foreground/70">
            Stay informed with expert insights, industry trends, and practical tips from our construction professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
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
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-foreground/60 mb-3">
                  <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{article.author}</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-foreground/70 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <Link 
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  Read More
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">No articles available yet.</p>
          </div>
        )}
        </div>
        
        <Footer />
      </div>
    </>
  );
}