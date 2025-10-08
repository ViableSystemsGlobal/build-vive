import { MetadataRoute } from 'next'

// Remove dynamic export - let it be static by default
// export const dynamic = 'force-dynamic';

async function getArticles() {
  try {
    // During build time, use static fallback data
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_BASE_URL) {
      // Return static articles for build time
      return [
        {
          slug: 'denver-construction-trends-2024',
          publishDate: '2024-01-15T00:00:00Z'
        },
        {
          slug: 'home-renovation-tips',
          publishDate: '2024-01-10T00:00:00Z'
        }
      ];
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/homepage`, {
      // Use revalidate for ISR (Incremental Static Regeneration)
      next: { revalidate: 3600 }, // Revalidate every hour
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.articles || [];
    }
  } catch (error) {
    console.error('Failed to load articles for sitemap:', error);
  }
  
  // Fallback to static articles
  return [
    {
      slug: 'denver-construction-trends-2024',
      publishDate: '2024-01-15T00:00:00Z'
    }
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buildvive.com'
  
  // Get articles with error handling
  let articles: any[] = [];
  try {
    articles = await getArticles();
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    articles = [];
  }
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ];

  // Only add blog pages if we have articles
  const blogPages = articles.length > 0 ? articles.map((article: any) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  })) : [];

  return [...staticPages, ...blogPages];
}
