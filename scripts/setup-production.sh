#!/bin/bash

# BuildVive Website - Production Setup Script
# This script sets up the production environment on your VPS

set -e

echo "🔧 Setting up BuildVive Website for production..."

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

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "Please run this script as root or with sudo"
        exit 1
    fi
}

# Install required packages
install_packages() {
    print_status "Installing required packages..."
    
    # Update package list
    apt update
    
    # Install essential packages
    apt install -y curl wget git nginx certbot python3-certbot-nginx
    
    print_success "Packages installed successfully!"
}

# Setup Nginx configuration
setup_nginx() {
    print_status "Setting up Nginx configuration..."
    
    # Create Nginx configuration for the application
    cat > /etc/nginx/sites-available/buildvive << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL configuration (will be set up by certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Proxy to EasyPanel application
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
    
    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Uploads directory
    location /uploads/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1d;
        add_header Cache-Control "public";
    }
}
EOF
    
    # Enable the site
    ln -sf /etc/nginx/sites-available/buildvive /etc/nginx/sites-enabled/
    
    # Remove default site
    rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    nginx -t
    
    # Restart Nginx
    systemctl restart nginx
    systemctl enable nginx
    
    print_success "Nginx configured successfully!"
}

# Setup SSL certificate
setup_ssl() {
    print_status "Setting up SSL certificate..."
    
    print_warning "Please make sure your domain is pointing to this server before continuing."
    read -p "Enter your domain name (e.g., yourdomain.com): " domain
    
    if [ -z "$domain" ]; then
        print_error "Domain name is required!"
        exit 1
    fi
    
    # Update Nginx configuration with actual domain
    sed -i "s/yourdomain.com/$domain/g" /etc/nginx/sites-available/buildvive
    
    # Reload Nginx
    systemctl reload nginx
    
    # Obtain SSL certificate
    certbot --nginx -d "$domain" -d "www.$domain" --non-interactive --agree-tos --email "admin@$domain"
    
    print_success "SSL certificate configured successfully!"
}

# Setup firewall
setup_firewall() {
    print_status "Setting up firewall..."
    
    # Install ufw if not present
    apt install -y ufw
    
    # Configure firewall rules
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3000/tcp  # EasyPanel port
    
    # Enable firewall
    ufw --force enable
    
    print_success "Firewall configured successfully!"
}

# Setup log rotation
setup_log_rotation() {
    print_status "Setting up log rotation..."
    
    cat > /etc/logrotate.d/buildvive << EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 640 nginx adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 \$(cat /var/run/nginx.pid)
        fi
    endscript
}
EOF
    
    print_success "Log rotation configured successfully!"
}

# Setup monitoring
setup_monitoring() {
    print_status "Setting up basic monitoring..."
    
    # Create a simple health check script
    cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash

# Simple health check for BuildVive website
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$response" = "200" ]; then
    echo "$(date): Website is healthy (HTTP $response)"
else
    echo "$(date): Website is unhealthy (HTTP $response)"
    # You can add notification logic here
fi
EOF
    
    chmod +x /usr/local/bin/health-check.sh
    
    # Add to crontab for regular health checks
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/health-check.sh >> /var/log/health-check.log") | crontab -
    
    print_success "Monitoring configured successfully!"
}

# Main setup function
main() {
    echo "🏗️  BuildVive Website - Production Setup"
    echo "========================================"
    
    # Check if running as root
    check_root
    
    # Install packages
    install_packages
    
    # Setup Nginx
    setup_nginx
    
    # Setup SSL
    setup_ssl
    
    # Setup firewall
    setup_firewall
    
    # Setup log rotation
    setup_log_rotation
    
    # Setup monitoring
    setup_monitoring
    
    echo ""
    print_success "🎉 Production setup completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Deploy your application using EasyPanel"
    echo "2. Test your website at https://yourdomain.com"
    echo "3. Check logs: tail -f /var/log/nginx/access.log"
    echo "4. Monitor health: tail -f /var/log/health-check.log"
    echo ""
    print_warning "Remember to:"
    echo "- Update your domain DNS settings"
    echo "- Configure your application environment variables in EasyPanel"
    echo "- Test all functionality after deployment"
    echo ""
    print_success "Your VPS is ready for BuildVive website deployment! 🚀"
}

# Run main function
main "$@"
