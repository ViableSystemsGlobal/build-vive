"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Footer } from "../../components/Footer";

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

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetch('/api/admin/homepage');
        if (response.ok) {
          const data = await response.json();
          const foundArticle = data.articles?.find((a: Article) => a.slug === slug);
          
          if (foundArticle) {
            setArticle(foundArticle);
          } else {
            setNotFound(true);
          }
        }
      } catch (error) {
        console.error('Failed to load article:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20">
        <div className="container-page py-20">
          <div className="text-center">Loading article...</div>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="pt-20">
        <div className="container-page py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-foreground/70 mb-8">The article you're looking for doesn't exist.</p>
            <Link 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
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
  );
}
