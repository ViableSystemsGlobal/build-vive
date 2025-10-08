# BuildVive Website - EasyPanel VPS Deployment Guide

## Overview
This guide will help you deploy your BuildVive website to your Hostinger VPS using EasyPanel.

## Prerequisites
- Hostinger VPS with EasyPanel installed
- Domain name pointed to your VPS
- SSH access to your VPS
- Git repository with your code

## Step 1: Prepare Your Application

### 1.1 Environment Configuration
Create a production environment file:

```bash
# Copy the example environment file
cp env.example .env.production
```

Edit `.env.production` with your production values:
```env
# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://yourdomain.com"

# Base URL
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"

# Admin credentials
ADMIN_EMAIL="your-admin@email.com"
ADMIN_PASSWORD="your-secure-password"

# File uploads (local storage for VPS)
UPLOAD_DIR="./public/uploads"
```

### 1.2 Build Configuration
Ensure your `next.config.js` is optimized for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
}

module.exports = nextConfig
```

## Step 2: EasyPanel Setup

### 2.1 Access EasyPanel
1. Open your browser and go to `http://your-vps-ip:3000`
2. Login to EasyPanel dashboard
3. Create a new project called "buildvive-website"

### 2.2 Create Application
1. Click "New Application"
2. Choose "Docker" as the source
3. Select "Git Repository" as the source type
4. Enter your Git repository URL
5. Set the branch to `main`

### 2.3 Configure Build Settings
In the build configuration:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: `3000`
- **Node Version**: `18` or `20`

## Step 3: Docker Configuration

### 3.1 Create Dockerfile
Create a `Dockerfile` in your project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 3.2 Create .dockerignore
Create a `.dockerignore` file:

```
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.env
.env.local
.env.production.local
.env.development.local
.git
.gitignore
.next
.vercel
```

## Step 4: Environment Variables in EasyPanel

### 4.1 Set Environment Variables
In EasyPanel, go to your application settings and add these environment variables:

```
NODE_ENV=production
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
DATABASE_URL=file:./dev.db
UPLOAD_DIR=./public/uploads
```

### 4.2 Domain Configuration
1. Go to "Domains" section in EasyPanel
2. Add your domain name
3. Enable SSL certificate (Let's Encrypt)
4. Set up redirects if needed

## Step 5: Database Setup

### 5.1 SQLite Database
Since you're using SQLite, the database file will be created automatically. However, you may want to:

1. **Initialize the database** on first deployment
2. **Set up database backups** for production

### 5.2 Database Initialization Script
Create a startup script to initialize the database:

```bash
#!/bin/bash
# Initialize database if it doesn't exist
if [ ! -f "dev.db" ]; then
    echo "Initializing database..."
    npx prisma db push
    echo "Database initialized successfully"
fi
```

## Step 6: File Storage Setup

### 6.1 Upload Directory
Ensure the uploads directory exists and has proper permissions:

```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

### 6.2 Persistent Storage
In EasyPanel, configure persistent storage for:
- `./public/uploads` - For uploaded images
- `./dev.db` - For SQLite database
- `./data` - For SEO and other data files

## Step 7: Deployment Process

### 7.1 Deploy via EasyPanel
1. **Connect Repository**: Link your Git repository
2. **Configure Build**: Set build and start commands
3. **Set Environment Variables**: Add all required env vars
4. **Deploy**: Click "Deploy" button

### 7.2 Manual Deployment (Alternative)
If you prefer manual deployment:

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Clone your repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Install dependencies
npm install

# Build the application
npm run build

# Start the application
npm start
```

## Step 8: Post-Deployment Configuration

### 8.1 SSL Certificate
1. In EasyPanel, go to "SSL" section
2. Enable "Let's Encrypt" certificate
3. Add your domain name
4. Wait for certificate generation

### 8.2 Domain DNS
Update your domain's DNS settings:
- **A Record**: Point to your VPS IP address
- **CNAME**: www.yourdomain.com → yourdomain.com

### 8.3 Firewall Configuration
Ensure these ports are open:
- **Port 80**: HTTP traffic
- **Port 443**: HTTPS traffic
- **Port 3000**: EasyPanel (if needed)

## Step 9: Monitoring and Maintenance

### 9.1 Application Monitoring
- Monitor application logs in EasyPanel
- Set up uptime monitoring
- Configure error tracking

### 9.2 Backup Strategy
- **Database**: Regular SQLite backups
- **Uploads**: Backup uploaded files
- **Configuration**: Backup environment variables

### 9.3 Updates
To update your application:
1. Push changes to your Git repository
2. In EasyPanel, click "Redeploy"
3. Monitor the deployment process

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs in EasyPanel

2. **Database Issues**
   - Ensure database file permissions
   - Check database initialization
   - Verify SQLite is working

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Ensure proper file paths

4. **SSL Certificate Issues**
   - Verify domain DNS settings
   - Check domain ownership
   - Wait for certificate propagation

### Logs and Debugging
- **Application Logs**: Available in EasyPanel dashboard
- **Build Logs**: Check build process for errors
- **System Logs**: SSH into VPS for system-level debugging

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **Admin Credentials**: Use strong passwords
3. **SSL**: Always use HTTPS in production
4. **Firewall**: Restrict unnecessary ports
5. **Updates**: Keep system and dependencies updated

## Performance Optimization

1. **Caching**: Enable Next.js caching
2. **CDN**: Consider using a CDN for static assets
3. **Database**: Optimize SQLite queries
4. **Images**: Optimize image sizes and formats

## Support

If you encounter issues:
1. Check EasyPanel documentation
2. Review application logs
3. Verify environment configuration
4. Test locally before deploying

---

**Next Steps**: After deployment, test all functionality including:
- Admin login
- File uploads
- SEO settings
- Contact forms
- All pages and features
