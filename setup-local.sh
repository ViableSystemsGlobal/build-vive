#!/bin/bash

echo "🚀 Setting up BuildVive Renovations for local development..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please update it with your actual values."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start PostgreSQL with Docker
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d db

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Initialize database tables
echo "🗄️ Initializing database tables..."
curl -X POST http://localhost:3000/api/init-db

# Build the application
echo "🔨 Building the application..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev"
echo ""
echo "🌐 Application will be available at:"
echo "   http://localhost:3000"
echo ""
echo "📊 Admin panel:"
echo "   http://localhost:3000/admin"
echo ""
echo "🗄️ Database:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: buildvive"
echo "   Username: postgres"
echo "   Password: password"
echo ""
echo "📝 Don't forget to update your .env file with actual values!"
