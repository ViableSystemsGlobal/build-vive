-- Database initialization script for BuildVive Renovations
-- This script creates the necessary tables for the application

-- Create homepage_data table
CREATE TABLE IF NOT EXISTS homepage_data (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create knowledge_base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_homepage_data_updated_at ON homepage_data(updated_at);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);

-- Insert default homepage data
INSERT INTO homepage_data (data) VALUES (
  '{
    "logoUrl": "",
    "companyName": "BuildVive Renovations",
    "footerLogoUrl": "",
    "footerCompanyName": "BuildVive Renovations",
    "footerDescription": "Building excellence in Denver since 2010. Your trusted partner for residential and commercial construction projects.",
    "footerAddress": "123 Construction Way, Denver, CO 80202",
    "footerPhone": "(555) 123-4567",
    "footerEmail": "info@buildvive.com",
    "faviconUrl": "",
    "badge": "#1 CONSTRUCTION COMPANY IN DENVER",
    "headline": "Unparalleled construction solutions in Denver",
    "subtext": "Experience excellence and durability with BuildVive Renovations Denver team of experts, offering innovative and unmatched residential and commercial solutions tailored to your needs.",
    "heroImage": "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop",
    "trustedUsers": "Trusted by 1 Million users",
    "openaiApiKey": "",
    "openaiModel": "gpt-4o-mini",
    "smtpHost": "",
    "smtpPort": "587",
    "smtpUsername": "",
    "smtpPassword": "",
    "adminEmails": "",
    "fromEmail": "",
    "services": [
      {"id": "1", "title": "Residential Construction", "description": "Custom homes and renovations", "icon": "🏠", "image": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop"},
      {"id": "2", "title": "Commercial Projects", "description": "Office buildings and retail spaces", "icon": "🏢", "image": "https://images.unsplash.com/photo-1577962917302-cd874c8f14d6?q=80&w=1400&auto=format&fit=crop"},
      {"id": "3", "title": "Renovations", "description": "Complete home and office makeovers", "icon": "🔨", "image": "https://images.unsplash.com/photo-1581091215367-59ab6f01b7f0?q=80&w=1400&auto=format&fit=crop"}
    ],
    "aboutTitle": "Building Excellence Since 2010",
    "aboutDescription": "With over a decade of experience in Denver construction industry, we have built our reputation on quality craftsmanship and customer satisfaction.",
    "aboutImage": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop",
    "stats": [
      {"number": "500+", "label": "Projects Completed"},
      {"number": "15+", "label": "Years Experience"},
      {"number": "98%", "label": "Client Satisfaction"}
    ],
    "projects": [
      {"id": "1", "title": "Modern Home Construction", "description": "Complete custom home build with premium materials and energy-efficient design.", "badge": "RESIDENTIAL", "image": "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1400&auto=format&fit=crop", "features": ["Custom design", "Energy efficient", "Premium materials"]},
      {"id": "2", "title": "Office Complex Development", "description": "Multi-story office building with modern amenities and sustainable features.", "badge": "COMMERCIAL", "image": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop", "features": ["Modern design", "Sustainable features", "Premium amenities"]},
      {"id": "3", "title": "Historic Building Restoration", "description": "Careful restoration preserving architectural integrity while modernizing systems.", "badge": "RENOVATION", "image": "https://images.unsplash.com/photo-1577962917302-cd874c8f14d6?q=80&w=1400&auto=format&fit=crop", "features": ["Heritage preservation", "Modern systems", "Historical accuracy"]}
    ],
    "articles": [
      {
        "id": "1",
        "title": "Planning a home renovation in Denver: what to know",
        "excerpt": "From permits to materials, here are the essentials for a smooth renovation project in Colorado.",
        "imageUrl": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1400&auto=format&fit=crop",
        "content": "<h2>Planning Your Denver Home Renovation</h2><p>Renovating a home in Denver requires careful planning and understanding of local regulations. Here is what you need to know:</p><h3>Permits and Regulations</h3><p>Denver has specific building codes and permit requirements that vary by project type. Before starting any renovation:</p><ul><li>Check if your project requires a permit</li><li>Understand zoning restrictions</li><li>Consider HOA requirements if applicable</li></ul><h3>Climate Considerations</h3><p>Denver unique climate affects material choices and construction timing:</p><ul><li>Choose weather-resistant materials</li><li>Plan for temperature fluctuations</li><li>Consider insulation upgrades</li></ul><h3>Budget Planning</h3><p>Set aside 20% of your budget for unexpected costs and always get multiple quotes from licensed contractors.</p>",
        "author": "BuildVive Renovations Team",
        "publishDate": "2024-01-15",
        "category": "Construction Tips",
        "featured": true,
        "slug": "planning-home-renovation-denver"
      }
    ],
    "trustedLogos": [
      {"id": "1", "imageUrl": "https://via.placeholder.com/120x60/4F46E5/white?text=Partner+1", "alt": "Partner 1"},
      {"id": "2", "imageUrl": "https://via.placeholder.com/120x60/059669/white?text=Partner+2", "alt": "Partner 2"},
      {"id": "3", "imageUrl": "https://via.placeholder.com/120x60/DC2626/white?text=Partner+3", "alt": "Partner 3"}
    ]
  }'
) ON CONFLICT (id) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_homepage_data_updated_at BEFORE UPDATE ON homepage_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
