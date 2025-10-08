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
   ```bash
   # On your local machine, create a zip file
   cd deploy-vps
   zip -r buildvive-vps.zip .
   
   # Upload to your VPS (replace with your VPS details)
   scp buildvive-vps.zip root@your-vps-ip:/root/
   ```

2. **On your VPS, extract and deploy:**
   ```bash
   # SSH into your VPS
   ssh root@your-vps-ip
   
   # Extract the files
   unzip buildvive-vps.zip
   
   # Run the deployment script
   chmod +x deploy-to-vps.sh
   ./deploy-to-vps.sh
   ```

## Manual Deployment Steps

If you prefer to deploy manually:

### 1. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install nginx
sudo apt install -y nginx
```

### 2. Deploy Application
```bash
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
```

### 3. Configure Nginx
```bash
# Copy nginx configuration
sudo cp nginx-buildvive.conf /etc/nginx/sites-available/buildvive
sudo ln -sf /etc/nginx/sites-available/buildvive /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart nginx
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Configure Systemd Service
```bash
# Copy service file
sudo cp buildvive.service /etc/systemd/system/

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable buildvive
sudo systemctl start buildvive
```

## Configuration

### Environment Variables
Edit `/var/www/buildvive/.env.production` to configure:
- Email settings (SMTP)
- Database connection (if using PostgreSQL)
- OpenAI API key (for chatbot)
- Other service configurations

### SSL Certificate (Recommended)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Monitoring and Maintenance

### Useful Commands
```bash
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
```

### Updating the Application
```bash
# Stop the application
sudo systemctl stop buildvive

# Backup current version
sudo cp -r /var/www/buildvive /var/www/buildvive-backup-$(date +%Y%m%d)

# Upload new version and extract
# (repeat upload and extraction steps)

# Install dependencies and restart
cd /var/www/buildvive
sudo -u www-data npm install --production
sudo systemctl start buildvive
```

## Troubleshooting

### Common Issues

1. **Application won't start:**
   - Check logs: `sudo journalctl -u buildvive -f`
   - Verify Node.js version: `node --version`
   - Check file permissions: `ls -la /var/www/buildvive`

2. **Nginx 502 Bad Gateway:**
   - Check if application is running: `sudo systemctl status buildvive`
   - Verify nginx configuration: `sudo nginx -t`
   - Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`

3. **File uploads not working:**
   - Check uploads directory permissions: `ls -la /var/www/buildvive/public/uploads`
   - Ensure directory is writable: `sudo chmod 755 /var/www/buildvive/public/uploads`

4. **Images not loading:**
   - Check nginx static file configuration
   - Verify file paths in nginx config
   - Check file permissions

## Security Considerations

1. **Firewall Configuration:**
   ```bash
   # Enable UFW firewall
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   ```

2. **Regular Updates:**
   ```bash
   # Update system regularly
   sudo apt update && sudo apt upgrade -y
   ```

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
