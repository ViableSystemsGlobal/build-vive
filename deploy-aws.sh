#!/bin/bash

echo "🚀 Starting AWS deployment for BuildVive Renovations..."

# Check if required environment variables are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "❌ Error: AWS credentials not set. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
    exit 1
fi

if [ -z "$S3_BUCKET_NAME" ]; then
    echo "❌ Error: S3_BUCKET_NAME not set"
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t buildvive-renovations .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Tag for ECR (replace with your ECR repository URL)
ECR_REPOSITORY="123456789012.dkr.ecr.us-east-1.amazonaws.com/buildvive-renovations"
echo "🏷️ Tagging image for ECR..."
docker tag buildvive-renovations:latest $ECR_REPOSITORY:latest

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REPOSITORY

if [ $? -ne 0 ]; then
    echo "❌ ECR login failed"
    exit 1
fi

# Push to ECR
echo "⬆️ Pushing to ECR..."
docker push $ECR_REPOSITORY:latest

if [ $? -ne 0 ]; then
    echo "❌ ECR push failed"
    exit 1
fi

# Update ECS service
echo "🔄 Updating ECS service..."
aws ecs update-service --cluster buildvive-cluster --service buildvive-service --force-new-deployment

if [ $? -ne 0 ]; then
    echo "❌ ECS service update failed"
    exit 1
fi

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://your-domain.com"
