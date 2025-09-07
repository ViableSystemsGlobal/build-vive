# BuildVive Renovations - AWS Migration Guide

This guide will help you migrate your BuildVive Renovations website from Vercel to AWS using EC2, RDS PostgreSQL, and S3.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   EC2 Instance  │    │   RDS PostgreSQL│    │   S3 Bucket     │
│   (Next.js App) │◄──►│   (Database)    │    │   (File Storage)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Route 53      │
                    │   (DNS)         │
                    └─────────────────┘
```

## 🚀 **Quick Start**

### 1. Local Development Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd website

# Run the setup script
./setup-local.sh

# Start development server
npm run dev
```

### 2. AWS Production Deployment
```bash
# Set up AWS infrastructure (see AWS-SETUP.md)
# Configure environment variables
# Deploy to production
./deploy-production.sh
```

## 📁 **File Structure**

```
website/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   ├── upload-s3/          # S3 file upload
│   │   ├── init-db/            # Database initialization
│   │   └── quote/              # Quote submission (updated for DB)
│   ├── lib/
│   │   ├── database.ts         # PostgreSQL connection
│   │   ├── s3.ts              # S3 file operations
│   │   └── storage.ts         # Multi-storage service
│   └── components/
├── docker-compose.yml          # Local development
├── Dockerfile                  # Production container
├── init.sql                   # Database schema
├── deploy-aws.sh              # AWS deployment script
├── setup-local.sh             # Local setup script
└── AWS-SETUP.md               # Detailed AWS setup guide
```

## 🔧 **Environment Variables**

### Required for AWS:
```bash
# Database
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/buildvive

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=buildvive-uploads

# Email (Hostinger SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USERNAME=your-email@buildvive.com
SMTP_PASSWORD=your-email-password

# OpenAI
OPENAI_API_KEY=your-openai-key

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number

# VAPI
VAPI_API_KEY=your-vapi-key
```

## 🗄️ **Database Schema**

The application uses PostgreSQL with the following tables:

- `homepage_data` - Website content and configuration
- `quotes` - Quote requests from customers
- `chat_history` - AI chatbot conversations
- `knowledge_base` - FAQ and knowledge articles

## 📦 **Storage Strategy**

The application uses a multi-tier storage approach:

1. **Primary**: PostgreSQL database for structured data
2. **Secondary**: S3 for file uploads (images, documents)
3. **Fallback**: Local file system for development
4. **Cache**: Vercel KV for performance (optional)

## 🚀 **Deployment Options**

### Option 1: Docker Compose (Local/Development)
```bash
docker-compose up -d
```

### Option 2: EC2 with PM2 (Production)
```bash
./deploy-production.sh
```

### Option 3: ECS with Docker (Scalable)
```bash
./deploy-aws.sh
```

## 🔄 **Migration Process**

### From Vercel to AWS:

1. **Set up AWS infrastructure** (RDS, S3, EC2)
2. **Configure environment variables**
3. **Initialize database tables**
4. **Deploy application**
5. **Update DNS records**
6. **Test all functionality**

### Data Migration:
- Homepage data: Automatically migrated via API
- Images: Upload to S3 via admin panel
- Quotes: Stored in PostgreSQL
- Chat history: Stored in PostgreSQL

## 🛠️ **Development Commands**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run local setup
./setup-local.sh

# Deploy to production
./deploy-production.sh
```

## 📊 **Monitoring**

### Application Monitoring:
- PM2 process manager
- CloudWatch logs
- Application health checks

### Database Monitoring:
- RDS performance insights
- Connection pooling
- Query optimization

### File Storage Monitoring:
- S3 access logs
- Storage usage metrics
- CDN performance

## 🔒 **Security**

### Database Security:
- SSL/TLS encryption
- VPC security groups
- IAM roles and policies

### Application Security:
- Environment variable protection
- Input validation
- Rate limiting

### File Storage Security:
- S3 bucket policies
- CORS configuration
- Access logging

## 🚨 **Troubleshooting**

### Common Issues:

1. **Database Connection Issues**
   ```bash
   # Check database status
   curl -X GET http://localhost:3000/api/init-db
   ```

2. **S3 Upload Issues**
   ```bash
   # Test S3 access
   aws s3 ls s3://your-bucket-name
   ```

3. **Application Not Starting**
   ```bash
   # Check PM2 logs
   pm2 logs buildvive
   pm2 status
   ```

### Log Locations:
- Application logs: PM2 logs
- Database logs: RDS logs
- S3 logs: CloudWatch logs

## 📈 **Performance Optimization**

### Database:
- Connection pooling
- Query optimization
- Indexing strategy

### Application:
- Next.js optimization
- Image optimization
- Caching strategies

### Infrastructure:
- Auto-scaling groups
- Load balancers
- CDN integration

## 💰 **Cost Optimization**

### Estimated Monthly Costs:
- EC2 t3.medium: ~$30
- RDS db.t3.micro: ~$15
- S3 storage (10GB): ~$0.25
- Data transfer: ~$9
- **Total: ~$55/month**

### Cost Optimization Tips:
- Use reserved instances
- Implement auto-scaling
- Optimize S3 storage classes
- Monitor usage patterns

## 🆘 **Support**

### Documentation:
- [AWS-SETUP.md](./AWS-SETUP.md) - Detailed AWS setup
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Getting Help:
1. Check application logs
2. Review AWS documentation
3. Contact AWS support
4. Check GitHub issues

---

**Note**: This migration maintains backward compatibility with your current Vercel setup while adding AWS capabilities.
