# Deployment Instructions for Hostinger

## Method 1: Upload via File Manager (Recommended)

1. **Zip the deploy folder contents:**
   ```bash
   cd deploy
   zip -r ace-construction.zip .
   ```

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
   ```bash
   npm install --production
   ```

5. **Start the application:**
   - The app should start automatically
   - Or run: `npm start`

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
