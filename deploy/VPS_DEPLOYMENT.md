# 🚀 Deploy Ace Construction to Hostinger VPS

## 📡 **Your VPS Details:**
- **IP Address**: `156.67.68.173`
- **Type**: Hostinger VPS
- **Goal**: Deploy without affecting other projects

---

## 🎯 **Step-by-Step VPS Deployment:**

### **Step 1: Create Deployment Package**
```bash
# From your local machine, in the website directory:
cd /Users/nanasasu/Desktop/aceconstruction/website
./deploy.sh
```

### **Step 2: SSH into Your VPS**
```bash
ssh root@156.67.68.173
```

### **Step 3: Create Dedicated Directory**
```bash
mkdir -p /var/www/ace-construction
cd /var/www/ace-construction
```

### **Step 4: Exit SSH (Back to Local)**
```bash
exit
```

### **Step 5: Upload the Package**
```bash
scp ace-construction.zip root@156.67.68.173:/var/www/ace-construction/
```

### **Step 6: SSH Back and Deploy**
```bash
ssh root@156.67.68.173
cd /var/www/ace-construction
unzip ace-construction.zip
rm ace-construction.zip
npm install --production
```

### **Step 7: Start the Application**
```bash
npm start
```

---

## 🌐 **Access Your Application:**

- **Website**: `http://156.67.68.173:3000`
- **Admin Panel**: `http://156.67.68.173:3000/admin/login`
  - Email: `admin@aceconstruction.local`
  - Password: `admin123`

---

## 🔧 **Production Setup (Optional):**

### **Use PM2 for Process Management:**
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "ace-construction" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### **Setup Reverse Proxy (if you have a domain):**
```bash
# Install nginx
apt update && apt install nginx

# Create nginx config
nano /etc/nginx/sites-available/ace-construction
```

Nginx config content:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/ace-construction /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 🛡️ **Security Notes:**

1. **Firewall**: Make sure port 3000 is open
2. **Environment**: Update `.env` file with production values
3. **SSL**: Consider adding SSL certificate for production

---

## 📁 **Directory Structure:**
```
/var/www/ace-construction/
├── .next/
├── public/
├── data/
├── package.json
├── .env
└── start.sh
```

---

## 🆘 **Troubleshooting:**

- **Port in use**: Change port in `package.json` or kill existing process
- **Permission denied**: Check file permissions with `ls -la`
- **Node not found**: Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`

Ready to deploy! 🚀

