import Link from "next/link";
import Image from "next/image";
import { Footer } from "../../components/Footer";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/homepage`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      return data.articles?.find((a: Article) => a.slug === slug) || null;
    }
  } catch (error) {
    console.error('Failed to load article:', error);
  }
  return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  
  if (!article) {
    return {
      title: "Article Not Found - BuildVive Renovations",
      description: "The article you're looking for doesn't exist.",
    };
  }

  return {
    title: `${article.title} - BuildVive Renovations Blog`,
    description: article.excerpt,
    keywords: `Denver construction, ${article.category}, construction tips, BuildVive Renovations, ${article.title}`,
    authors: [{ name: article.author }],
    openGraph: {
      title: `${article.title} - BuildVive Renovations Blog`,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishDate,
      authors: [article.author],
      images: [
        {
          url: article.imageUrl,
          width: 800,
          height: 450,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} - BuildVive Renovations Blog`,
      description: article.excerpt,
      images: [article.imageUrl],
    },
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  // Generate structured data for article
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.imageUrl,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "BuildVive Renovations",
      "url": process.env.NEXT_PUBLIC_BASE_URL || "https://buildvive.com",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://buildvive.com'}/logo.png`
      }
    },
    "datePublished": article.publishDate,
    "dateModified": article.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://buildvive.com'}/blog/${article.slug}`
    },
    "articleSection": article.category,
    "keywords": `Denver construction, ${article.category}, construction tips, BuildVive Renovations`,
    "wordCount": article.content.split(' ').length,
    "articleBody": article.content
  };

  return (
    <>
      {/* Structured Data for Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="pt-20">
        <div className="container-page py-20">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {article.category}
              </span>
              {article.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                  FEATURED
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 text-foreground/60 mb-6">
              <span>By {article.author}</span>
              <span>•</span>
              <span>{new Date(article.publishDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            <p className="text-xl text-foreground/70 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* Featured Image */}
          <div className="mb-12">
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden">
              <Image 
                src={article.imageUrl}
                alt={article.title}
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Related Articles */}
        <div className="mt-20 pt-12 border-t border-foreground/10">
          <h2 className="text-3xl font-bold mb-8 text-center">More Articles</h2>
          <div className="text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              View All Articles
            </Link>
          </div>
        </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
}
