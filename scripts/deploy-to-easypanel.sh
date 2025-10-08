#!/bin/bash

# BuildVive Website - EasyPanel Deployment Script
# This script helps deploy your application to EasyPanel

set -e

echo "🚀 Starting BuildVive Website deployment to EasyPanel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_requirements() {
    print_status "Checking requirements..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    if [ ! -f "Dockerfile" ]; then
        print_error "Dockerfile not found. Please create one first."
        exit 1
    fi
    
    if [ ! -f "next.config.js" ]; then
        print_error "next.config.js not found."
        exit 1
    fi
    
    print_success "All required files found!"
}

# Build the application
build_application() {
    print_status "Building application..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm ci
    
    # Build the application
    print_status "Building Next.js application..."
    npm run build
    
    print_success "Application built successfully!"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p public/uploads
    mkdir -p data
    
    # Set proper permissions
    chmod 755 public/uploads
    chmod 755 data
    
    print_success "Directories created!"
}

# Check environment variables
check_environment() {
    print_status "Checking environment configuration..."
    
    if [ ! -f ".env.local" ] && [ ! -f ".env.production" ]; then
        print_warning "No environment file found. Please create .env.local with your production settings."
        print_status "You can copy env.production.example as a starting point:"
        print_status "cp env.production.example .env.local"
        print_status "Then edit .env.local with your actual values."
    fi
    
    print_success "Environment check completed!"
}

# Generate production build info
generate_build_info() {
    print_status "Generating build information..."
    
    cat > build-info.json << EOF
{
  "buildDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)"
}
EOF
    
    print_success "Build information generated!"
}

# Main deployment function
main() {
    echo "🏗️  BuildVive Website - EasyPanel Deployment"
    echo "=============================================="
    
    # Check requirements
    check_requirements
    
    # Create directories
    create_directories
    
    # Check environment
    check_environment
    
    # Build application
    build_application
    
    # Generate build info
    generate_build_info
    
    echo ""
    print_success "🎉 Local build completed successfully!"
    echo ""
    print_status "Next steps for EasyPanel deployment:"
    echo "1. Push your code to your Git repository"
    echo "2. In EasyPanel dashboard:"
    echo "   - Create a new application"
    echo "   - Connect your Git repository"
    echo "   - Set the following environment variables:"
    echo "     * NODE_ENV=production"
    echo "     * NEXTAUTH_SECRET=your-secret-key"
    echo "     * NEXTAUTH_URL=https://yourdomain.com"
    echo "     * NEXT_PUBLIC_BASE_URL=https://yourdomain.com"
    echo "     * ADMIN_EMAIL=your-admin@email.com"
    echo "     * ADMIN_PASSWORD=your-secure-password"
    echo "   - Configure persistent volumes for:"
    echo "     * ./public/uploads"
    echo "     * ./dev.db"
    echo "     * ./data"
    echo "   - Deploy the application"
    echo ""
    print_status "For detailed instructions, see: easypanel-deployment.md"
    echo ""
    print_success "Ready for EasyPanel deployment! 🚀"
}

# Run main function
main "$@"
