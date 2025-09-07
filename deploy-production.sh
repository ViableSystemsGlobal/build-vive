#!/bin/bash

echo "🚀 Deploying BuildVive Renovations to production..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not set"
    exit 1
fi

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "❌ Error: AWS credentials not set"
    exit 1
fi

if [ -z "$S3_BUCKET_NAME" ]; then
    echo "❌ Error: S3_BUCKET_NAME not set"
    exit 1
fi

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Test database connection
echo "🗄️ Testing database connection..."
curl -X GET http://localhost:3000/api/init-db

if [ $? -ne 0 ]; then
    echo "❌ Database connection test failed"
    exit 1
fi

# Initialize database tables if needed
echo "🗄️ Initializing database tables..."
curl -X POST http://localhost:3000/api/init-db

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start npm --name "buildvive" -- start
pm2 save
pm2 startup

# Check application status
echo "📊 Application status:"
pm2 status

echo "✅ Deployment complete!"
echo ""
echo "🌐 Application is running at:"
echo "   http://localhost:3000"
echo ""
echo "📊 Monitor with:"
echo "   pm2 logs buildvive"
echo "   pm2 status"
echo ""
echo "🔄 To restart:"
echo "   pm2 restart buildvive"
