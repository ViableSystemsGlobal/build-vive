# ACE Construction - Setup Guide

## 🚀 **Quick Start (When Things Break)**

If your project stops working, follow these steps:

### **Step 1: Restore from Backup**
```bash
# Copy your working version back
cp -r deploy/app/* app/
cp deploy/next.config.ts next.config.ts
cp deploy/package.json package.json
```

### **Step 2: Clean & Reinstall**
```bash
rm -rf .next
rm -rf node_modules
npm install
```

### **Step 3: Start Dev Server**
```bash
npm run dev
```

## 📦 **Required Dependencies**

Your project needs these exact versions:
```json
{
  "dependencies": {
    "next": "15.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "postcss": "^8.5.6",
    "autoprefixer": "^10.4.21"
  }
}
```

## ⚙️ **Critical Config Files**

### **postcss.config.js**
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### **tailwind.config.js**
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        // ... other colors
      },
    },
  },
  plugins: [],
}
```

### **globals.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom CSS variables */
:root {
  --background: #ffffff;
  --foreground: #1c1c1c;
  --primary: #ff4c00;
}
```

## 🚨 **What NOT to Change**

- **Don't modify** the `deploy/` folder
- **Don't update** Next.js beyond 15.1.3 without testing
- **Don't change** the PostCSS config structure
- **Don't modify** the Tailwind config content paths

## 🔧 **Troubleshooting**

### **If you get "Module not found: tailwindcss"**
```bash
npm install -D tailwindcss@^3.4.0 postcss@^8.5.0 autoprefixer@^10.4.0
```

### **If you get PostCSS errors**
```bash
# Make sure postcss.config.js exists and has correct syntax
# NOT postcss.config.mjs
```

### **If you get build errors**
```bash
rm -rf .next
npm run dev
```

## 💾 **Backup Commands**

```bash
# Create a backup before making changes
cp -r app/ backup/app-$(date +%Y%m%d-%H%M%S)/

# Restore from backup if needed
cp -r backup/app-YYYYMMDD-HHMMSS/* app/
```

## 📱 **Your Working URLs**

- **Homepage**: http://localhost:3000
- **About**: http://localhost:3000/about
- **Blog**: http://localhost:3000/blog
- **Contact**: http://localhost:3000/contact
- **Projects**: http://localhost:3000/projects/[slug]
- **Admin**: http://localhost:3000/admin

---

**Remember**: Always test changes in a development environment first!
