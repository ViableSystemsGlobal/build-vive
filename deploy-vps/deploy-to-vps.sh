#!/bin/bash

# VPS Deployment Script
# Run this script on your VPS to deploy the application

echo "🚀 Deploying BuildVive Renovations to VPS..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+ if not already installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "🌐 Installing nginx..."
    sudo apt install -y nginx
fi

# Create application directory
sudo mkdir -p /var/www/buildvive
sudo chown -R www-data:www-data /var/www/buildvive

# Copy application files
sudo cp -r * /var/www/buildvive/
cd /var/www/buildvive

# Install dependencies
echo "📦 Installing dependencies..."
sudo -u www-data npm install --production

# Create uploads directory with proper permissions
sudo mkdir -p /var/www/buildvive/public/uploads
sudo chown -R www-data:www-data /var/www/buildvive/public/uploads
sudo chmod -R 755 /var/www/buildvive/public/uploads

# Copy nginx configuration
sudo cp nginx-buildvive.conf /etc/nginx/sites-available/buildvive
sudo ln -sf /etc/nginx/sites-available/buildvive /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Copy systemd service
sudo cp buildvive.service /etc/systemd/system/

# Reload systemd and start services
sudo systemctl daemon-reload
sudo systemctl enable buildvive
sudo systemctl start buildvive
sudo systemctl restart nginx

# Check status
echo "📊 Checking service status..."
sudo systemctl status buildvive --no-pager
sudo systemctl status nginx --no-pager

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your application should be available at: http://your-domain.com"
echo "🔐 Admin login: http://your-domain.com/login"
echo "   Username: admin@buildvive.local"
echo "   Password: admin123"
echo ""
echo "📋 Useful commands:"
echo "  - Check app status: sudo systemctl status buildvive"
echo "  - View app logs: sudo journalctl -u buildvive -f"
echo "  - Restart app: sudo systemctl restart buildvive"
echo "  - Check nginx status: sudo systemctl status nginx"
