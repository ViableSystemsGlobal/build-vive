#!/bin/bash

# VPS Deployment Script for BuildVive Renovations
# This script prepares your application for VPS deployment

echo "🚀 Preparing BuildVive Renovations for VPS deployment..."

# Build the project
echo "📦 Building project..."
npm run build

# Create VPS deployment directory
echo "📁 Creating VPS deployment package..."
rm -rf deploy-vps
mkdir -p deploy-vps

# Copy essential files for VPS deployment
echo "📋 Copying application files..."
cp -r .next deploy-vps/
cp -r public deploy-vps/
cp -r app deploy-vps/
cp package.json deploy-vps/
cp package-lock.json deploy-vps/
cp next.config.js deploy-vps/
cp next.config.ts deploy-vps/
cp -r lib deploy-vps/
cp -r components deploy-vps/
cp -r hooks deploy-vps/
cp -r api deploy-vps/
cp -r middleware.ts deploy-vps/
cp -r tailwind.config.js deploy-vps/
cp -r postcss.config.js deploy-vps/
cp -r tsconfig.json deploy-vps/

# Create data directory for JSON storage
mkdir -p deploy-vps/data

# Copy any existing data
if [ -f "data/homepage.json" ]; then
    cp data/homepage.json deploy-vps/data/
fi

# Create production environment file
echo "⚙️ Creating production environment file..."
cat > deploy-vps/.env.production << EOL
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Database (if using PostgreSQL)
# DATABASE_URL=postgresql://username:password@localhost:5432/buildvive

# Email settings (configure these for your VPS)
# SMTP_HOST=your-smtp-host
# SMTP_PORT=587
# SMTP_USERNAME=your-email@domain.com
# SMTP_PASSWORD=your-email-password
# FROM_EMAIL=your-email@domain.com

# OpenAI (optional - for chatbot)
# OPENAI_API_KEY=your-openai-key

# Admin settings
ADMIN_EMAILS=admin@buildvive.local
EOL

# Create systemd service file for VPS
echo "🔧 Creating systemd service file..."
cat > deploy-vps/buildvive.service << EOL
[Unit]
Description=BuildVive Renovations Web Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/buildvive
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=0.0.0.0

[Install]
WantedBy=multi-user.target
EOL

# Create nginx configuration
echo "🌐 Creating nginx configuration..."
cat > deploy-vps/nginx-buildvive.conf << EOL
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL configuration (you'll need to configure SSL certificates)
    # ssl_certificate /path/to/your/certificate.crt;
    # ssl_certificate_key /path/to/your/private.key;

    # For now, comment out SSL and use HTTP only
    # Remove the above redirect and use this block for HTTP only

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Handle static files directly
    location /uploads/ {
        alias /var/www/buildvive/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /_next/static/ {
        alias /var/www/buildvive/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOL

# Create deployment script for VPS
echo "📜 Creating VPS deployment script..."
cat > deploy-vps/deploy-to-vps.sh << EOL
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
EOL

chmod +x deploy-vps/deploy-to-vps.sh

# Create VPS deployment instructions
echo "📖 Creating VPS deployment instructions..."
cat > deploy-vps/VPS_DEPLOYMENT.md << EOL
# VPS Deployment Guide for BuildVive Renovations

## Prerequisites

Your VPS should have:
- Ubuntu 20.04+ or similar Linux distribution
- Root or sudo access
- At least 1GB RAM
- At least 10GB disk space
- Domain name pointing to your VPS IP

## Quick Deployment

1. **Upload files to your VPS:**
   \`\`\`bash
   # On your local machine, create a zip file
   cd deploy-vps
   zip -r buildvive-vps.zip .
   
   # Upload to your VPS (replace with your VPS details)
   scp buildvive-vps.zip root@your-vps-ip:/root/
   \`\`\`

2. **On your VPS, extract and deploy:**
   \`\`\`bash
   # SSH into your VPS
   ssh root@your-vps-ip
   
   # Extract the files
   unzip buildvive-vps.zip
   
   # Run the deployment script
   chmod +x deploy-to-vps.sh
   ./deploy-to-vps.sh
   \`\`\`

## Manual Deployment Steps

If you prefer to deploy manually:

### 1. Install Dependencies
\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install nginx
sudo apt install -y nginx
\`\`\`

### 2. Deploy Application
\`\`\`bash
# Create application directory
sudo mkdir -p /var/www/buildvive
sudo chown -R www-data:www-data /var/www/buildvive

# Copy your application files to /var/www/buildvive/
# Install dependencies
cd /var/www/buildvive
sudo -u www-data npm install --production

# Create uploads directory
sudo mkdir -p /var/www/buildvive/public/uploads
sudo chown -R www-data:www-data /var/www/buildvive/public/uploads
sudo chmod -R 755 /var/www/buildvive/public/uploads
\`\`\`

### 3. Configure Nginx
\`\`\`bash
# Copy nginx configuration
sudo cp nginx-buildvive.conf /etc/nginx/sites-available/buildvive
sudo ln -sf /etc/nginx/sites-available/buildvive /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart nginx
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### 4. Configure Systemd Service
\`\`\`bash
# Copy service file
sudo cp buildvive.service /etc/systemd/system/

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable buildvive
sudo systemctl start buildvive
\`\`\`

## Configuration

### Environment Variables
Edit \`/var/www/buildvive/.env.production\` to configure:
- Email settings (SMTP)
- Database connection (if using PostgreSQL)
- OpenAI API key (for chatbot)
- Other service configurations

### SSL Certificate (Recommended)
\`\`\`bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
\`\`\`

## Monitoring and Maintenance

### Useful Commands
\`\`\`bash
# Check application status
sudo systemctl status buildvive

# View application logs
sudo journalctl -u buildvive -f

# Restart application
sudo systemctl restart buildvive

# Check nginx status
sudo systemctl status nginx

# View nginx logs
sudo tail -f /var/log/nginx/error.log
\`\`\`

### Updating the Application
\`\`\`bash
# Stop the application
sudo systemctl stop buildvive

# Backup current version
sudo cp -r /var/www/buildvive /var/www/buildvive-backup-\$(date +%Y%m%d)

# Upload new version and extract
# (repeat upload and extraction steps)

# Install dependencies and restart
cd /var/www/buildvive
sudo -u www-data npm install --production
sudo systemctl start buildvive
\`\`\`

## Troubleshooting

### Common Issues

1. **Application won't start:**
   - Check logs: \`sudo journalctl -u buildvive -f\`
   - Verify Node.js version: \`node --version\`
   - Check file permissions: \`ls -la /var/www/buildvive\`

2. **Nginx 502 Bad Gateway:**
   - Check if application is running: \`sudo systemctl status buildvive\`
   - Verify nginx configuration: \`sudo nginx -t\`
   - Check nginx error logs: \`sudo tail -f /var/log/nginx/error.log\`

3. **File uploads not working:**
   - Check uploads directory permissions: \`ls -la /var/www/buildvive/public/uploads\`
   - Ensure directory is writable: \`sudo chmod 755 /var/www/buildvive/public/uploads\`

4. **Images not loading:**
   - Check nginx static file configuration
   - Verify file paths in nginx config
   - Check file permissions

## Security Considerations

1. **Firewall Configuration:**
   \`\`\`bash
   # Enable UFW firewall
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   \`\`\`

2. **Regular Updates:**
   \`\`\`bash
   # Update system regularly
   sudo apt update && sudo apt upgrade -y
   \`\`\`

3. **Backup Strategy:**
   - Regular backups of application files
   - Database backups (if using database)
   - SSL certificate backups

## Support

If you encounter issues:
1. Check the logs first
2. Verify all prerequisites are met
3. Ensure proper file permissions
4. Check nginx and systemd service configurations
EOL

echo ""
echo "✅ VPS deployment package created successfully!"
echo ""
echo "📦 Contents of 'deploy-vps' directory:"
ls -la deploy-vps/
echo ""
echo "🚀 Next steps:"
echo "1. Review deploy-vps/VPS_DEPLOYMENT.md for detailed instructions"
echo "2. Create a zip file: cd deploy-vps && zip -r buildvive-vps.zip ."
echo "3. Upload to your VPS and run the deployment script"
echo ""
echo "📋 VPS Requirements:"
echo "  - Ubuntu 20.04+ or similar Linux"
echo "  - Root/sudo access"
echo "  - At least 1GB RAM"
echo "  - At least 10GB disk space"
echo "  - Domain name pointing to VPS IP"
echo ""
echo "🔐 Admin login: admin@buildvive.local / admin123"
echo "🌐 Admin URL: http://your-domain.com/login"
