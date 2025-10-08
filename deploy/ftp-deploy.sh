#!/bin/bash

# 🚀 FTP Deployment Script for Hostinger VPS
# Usage: ./ftp-deploy.sh

echo "🚀 FTP Deployment for Ace Construction"
echo "======================================"

# FTP Settings (update these with your actual credentials)
FTP_HOST="156.67.68.173"
FTP_USER="your_ftp_username"
FTP_PASS="your_ftp_password"
FTP_PATH="/public_html/ace-construction"

echo ""
echo "📋 Current Settings:"
echo "Host: $FTP_HOST"
echo "User: $FTP_USER"
echo "Path: $FTP_PATH"
echo ""

# Check if zip file exists
if [ ! -f "ace-construction.zip" ]; then
    echo "❌ Error: ace-construction.zip not found!"
    echo "Please run ./deploy.sh first to create the package."
    exit 1
fi

echo "📦 Uploading ace-construction.zip..."
echo ""

# Upload using curl (built into macOS)
curl -T ace-construction.zip \
     -u "$FTP_USER:$FTP_PASS" \
     "ftp://$FTP_HOST$FTP_PATH/ace-construction.zip"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Upload successful!"
    echo ""
    echo "🔧 Next steps on your VPS:"
    echo "1. Login to Hostinger control panel"
    echo "2. Go to File Manager"
    echo "3. Navigate to $FTP_PATH"
    echo "4. Extract ace-construction.zip"
    echo "5. Delete the zip file"
    echo "6. Open terminal/SSH in control panel"
    echo "7. Run: cd $FTP_PATH && npm install --production && npm start"
    echo ""
    echo "🌐 Your site will be available at:"
    echo "http://156.67.68.173:3000"
    echo "Admin: http://156.67.68.173:3000/login"
else
    echo ""
    echo "❌ Upload failed!"
    echo "Please check your FTP credentials and try again."
fi

