#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Create deployment directory
echo "Creating deployment package..."
rm -rf deploy
mkdir -p deploy

# Copy essential files
cp -r .next deploy/
cp -r public deploy/
cp -r app deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp next.config.ts deploy/

# Create data directory for JSON storage
mkdir -p deploy/data

# Copy any existing data
if [ -f "data/homepage.json" ]; then
    cp data/homepage.json deploy/data/
fi

# Create production env file
echo "Creating .env file..."
cat > deploy/.env << EOL
NODE_ENV=production
EOL

# Create start script for Hostinger
echo "Creating start script..."
cat > deploy/start.sh << EOL
#!/bin/bash
export PORT=3000
npm install --production
npm start
EOL
chmod +x deploy/start.sh

# Create .htaccess for Apache (Hostinger uses Apache)
echo "Creating .htaccess..."
cat > deploy/.htaccess << EOL
RewriteEngine On

# Handle Next.js routes
RewriteRule ^api/(.*)$ /api/\$1 [L]
RewriteRule ^_next/(.*)$ /_next/\$1 [L]
RewriteRule ^uploads/(.*)$ /uploads/\$1 [L]

# Handle all other routes through Next.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.js [L]
EOL

# Create uploads directory with proper permissions
echo "Setting up uploads directory..."
mkdir -p deploy/public/uploads
touch deploy/public/uploads/.keep
chmod 755 deploy/public/uploads

# Create package.json optimized for production
echo "Optimizing package.json for production..."
cat > deploy/package.json << EOL
{
  "name": "ace-construction",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p \${PORT:-3000}",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.1.3",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
EOL

# Create deployment instructions
echo "Creating deployment instructions..."
cat > deploy/DEPLOY_INSTRUCTIONS.md << EOL
# Deployment Instructions for Hostinger

## Method 1: Upload via File Manager (Recommended)

1. **Zip the deploy folder contents:**
   \`\`\`bash
   cd deploy
   zip -r ace-construction.zip .
   \`\`\`

2. **Upload to Hostinger:**
   - Login to your Hostinger control panel
   - Go to File Manager
   - Navigate to your domain's public_html folder
   - Upload ace-construction.zip
   - Extract the zip file
   - Delete the zip file

3. **Set up Node.js (if not already done):**
   - In Hostinger control panel, go to "Advanced" → "Node.js"
   - Create a new Node.js app
   - Set Node.js version to 18 or higher
   - Set startup file to: server.js or app.js (Hostinger will guide you)

4. **Install dependencies:**
   - In the Node.js app terminal (or File Manager terminal):
   \`\`\`bash
   npm install --production
   \`\`\`

5. **Start the application:**
   - The app should start automatically
   - Or run: \`npm start\`

## Method 2: FTP Upload

1. **Use an FTP client (FileZilla, etc.):**
   - Host: your-domain.com
   - Username: your FTP username
   - Password: your FTP password

2. **Upload all files from the 'deploy' folder to public_html**

3. **Follow steps 3-5 from Method 1**

## Important Notes:

- The uploads folder will store user-uploaded images
- Make sure the uploads folder has write permissions (755)
- Your admin login credentials are: admin / admin123
- Access admin at: https://your-domain.com/admin/login

## Troubleshooting:

- If images don't upload, check uploads folder permissions
- If the site doesn't load, check Node.js app configuration
- Check Hostinger's error logs for any issues
EOL

echo ""
echo "✅ Deployment package created successfully!"
echo ""
echo "📦 Contents of 'deploy' directory:"
ls -la deploy/
echo ""
echo "🚀 Next steps:"
echo "1. Review deploy/DEPLOY_INSTRUCTIONS.md for detailed deployment steps"
echo "2. Zip the deploy folder: cd deploy && zip -r ace-construction.zip ."
echo "3. Upload to your Hostinger hosting via File Manager or FTP"
echo "4. Set up Node.js app in Hostinger control panel"
echo "5. Install dependencies and start the app"
echo ""
echo "🔐 Admin login: admin / admin123"
echo "🌐 Admin URL: https://your-domain.com/admin/login"