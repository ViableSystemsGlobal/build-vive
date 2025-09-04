# ACE Construction - Next.js Website

This is a [Next.js](https://nextjs.org) project for ACE Construction, a Denver-based construction company.

## ⚠️ IMPORTANT: CHANGE MANAGEMENT POLICY

**NO CODE CHANGES SHOULD BE MADE WITHOUT EXPLICIT USER PERMISSION.**

This project is in active development and all modifications must be approved by the user before implementation.

## 🏗️ Current Project State

### Architecture
- **Framework**: Next.js 15.1.3 with App Router
- **Styling**: Tailwind CSS with custom color scheme
- **Language**: TypeScript
- **State Management**: React Context API for quote modal
- **Database**: Prisma ORM with SQLite

### Key Components
- **Navbar**: Fixed navigation with active section highlighting
- **Hero Section**: Main landing area with CTA buttons
- **Services Slider**: Interactive service showcase with navigation
- **Projects Slider**: Portfolio display with project details
- **About Section**: Company information with image
- **Articles & News**: Professional blog section
- **Quote Modal**: Multi-step form for project quotes

### Current Features
- ✅ Fixed navbar with smooth scrolling
- ✅ Dynamic sliders for services and projects
- ✅ Enhanced quote form with file uploads
- ✅ Professional article layout
- ✅ Responsive design with Tailwind CSS
- ✅ Active section highlighting in navigation
- ✅ Image optimization with Next.js Image component

### Recent Implementations
- Quote modal refactored to use React Context
- File upload functionality for project images
- Detailed address collection (street, city, state, zip)
- Enhanced quote form with urgency and comments
- User-friendly review page instead of JSON display

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation
```bash
cd website
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
website/
├── app/
│   ├── components/
│   │   ├── Navbar.tsx          # Main navigation
│   │   ├── QuoteModal.tsx      # Quote form modal
│   │   └── QuoteProvider.tsx   # Context provider
│   ├── api/
│   │   ├── admin/
│   │   │   └── homepage/       # Admin API routes
│   │   └── quote/              # Quote submission API
│   ├── globals.css             # Global styles + Tailwind
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── prisma/                     # Database schema
├── public/                     # Static assets
└── tailwind.config.js          # Tailwind configuration
```

## 🎨 Design System

### Colors
- **Primary**: #ff4c00 (Brand Orange)
- **Background**: #ffffff (White)
- **Foreground**: #0f1216 (Dark)
- **Accent**: #fbbf24 (Amber)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Extrabold weight
- **Body**: Regular weight with proper hierarchy

## 🔧 Configuration Files

- **next.config.ts**: Next.js configuration
- **tailwind.config.js**: Tailwind CSS configuration
- **postcss.config.js**: PostCSS configuration
- **tsconfig.json**: TypeScript configuration

## 📝 Development Guidelines

1. **Always ask for permission** before making any code changes
2. **Document changes** in this README when approved
3. **Test thoroughly** before committing changes
4. **Maintain responsive design** across all screen sizes
5. **Follow existing code patterns** and structure

## 🚫 What NOT to Change Without Permission

- Component structure and naming
- API endpoints and data flow
- Styling and color schemes
- Database schema
- File organization
- Dependencies and versions

## 🔍 Troubleshooting

### Common Issues
- **Port conflicts**: Server will automatically try next available port
- **Build errors**: Clear `.next` folder and reinstall dependencies
- **Image loading**: Ensure proper Next.js Image component usage

### Reset Commands
```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
npm install

# Restart development server
npm run dev
```

## 📞 Support

For any questions or issues, please contact the development team. All changes must be approved before implementation.

---

**Last Updated**: September 3, 2025
**Project Status**: Active Development
**Change Approval Required**: Yes
