# AWS Infrastructure Setup Guide for BuildVive Renovations

This guide will help you set up the complete AWS infrastructure for your BuildVive Renovations website.

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

## 📋 **Prerequisites**

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Docker installed (for local testing)
- Domain name (optional, for custom domain)

## 🚀 **Step 1: Create RDS PostgreSQL Database**

### 1.1 Create RDS Instance
```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
    --db-instance-identifier buildvive-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username postgres \
    --master-user-password YourSecurePassword123! \
    --allocated-storage 20 \
    --storage-type gp2 \
    --vpc-security-group-ids sg-xxxxxxxxx \
    --db-subnet-group-name buildvive-subnet-group \
    --backup-retention-period 7 \
    --multi-az \
    --storage-encrypted \
    --tags Key=Name,Value=BuildVive-Database Key=Environment,Value=Production
```

### 1.2 Create Security Group for RDS
```bash
# Create security group for RDS
aws ec2 create-security-group \
    --group-name buildvive-rds-sg \
    --description "Security group for BuildVive RDS instance"

# Allow PostgreSQL access from EC2
aws ec2 authorize-security-group-ingress \
    --group-name buildvive-rds-sg \
    --protocol tcp \
    --port 5432 \
    --source-group buildvive-ec2-sg
```

### 1.3 Create Subnet Group
```bash
# Create DB subnet group
aws rds create-db-subnet-group \
    --db-subnet-group-name buildvive-subnet-group \
    --db-subnet-group-description "Subnet group for BuildVive RDS" \
    --subnet-ids subnet-xxxxxxxxx subnet-yyyyyyyyy
```

## 🚀 **Step 2: Create S3 Bucket for File Storage**

### 2.1 Create S3 Bucket
```bash
# Create S3 bucket
aws s3 mb s3://buildvive-uploads-$(date +%s)

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket buildvive-uploads-$(date +%s) \
    --versioning-configuration Status=Enabled

# Configure CORS
aws s3api put-bucket-cors \
    --bucket buildvive-uploads-$(date +%s) \
    --cors-configuration file://cors-config.json
```

### 2.2 CORS Configuration (cors-config.json)
```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}
```

## 🚀 **Step 3: Create EC2 Instance**

### 3.1 Create Security Group for EC2
```bash
# Create security group for EC2
aws ec2 create-security-group \
    --group-name buildvive-ec2-sg \
    --description "Security group for BuildVive EC2 instance"

# Allow HTTP access
aws ec2 authorize-security-group-ingress \
    --group-name buildvive-ec2-sg \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

# Allow HTTPS access
aws ec2 authorize-security-group-ingress \
    --group-name buildvive-ec2-sg \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

# Allow SSH access (replace with your IP)
aws ec2 authorize-security-group-ingress \
    --group-name buildvive-ec2-sg \
    --protocol tcp \
    --port 22 \
    --cidr YOUR_IP_ADDRESS/32
```

### 3.2 Create EC2 Instance
```bash
# Create EC2 instance
aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --count 1 \
    --instance-type t3.medium \
    --key-name your-key-pair \
    --security-group-ids sg-xxxxxxxxx \
    --subnet-id subnet-xxxxxxxxx \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=BuildVive-WebServer}]' \
    --user-data file://user-data.sh
```

### 3.3 User Data Script (user-data.sh)
```bash
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Create app directory
mkdir -p /home/ec2-user/buildvive
chown ec2-user:ec2-user /home/ec2-user/buildvive
```

## 🚀 **Step 4: Create IAM Role and Policies**

### 4.1 Create IAM Role for EC2
```bash
# Create IAM role
aws iam create-role \
    --role-name BuildVive-EC2-Role \
    --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
    --role-name BuildVive-EC2-Role \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-role-policy \
    --role-name BuildVive-EC2-Role \
    --policy-arn arn:aws:iam::aws:policy/AmazonRDSFullAccess

# Create instance profile
aws iam create-instance-profile \
    --instance-profile-name BuildVive-EC2-Profile

aws iam add-role-to-instance-profile \
    --instance-profile-name BuildVive-EC2-Profile \
    --role-name BuildVive-EC2-Role
```

### 4.2 Trust Policy (trust-policy.json)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

## 🚀 **Step 5: Set Up Application Load Balancer (Optional)**

### 5.1 Create Application Load Balancer
```bash
# Create ALB
aws elbv2 create-load-balancer \
    --name buildvive-alb \
    --subnets subnet-xxxxxxxxx subnet-yyyyyyyyy \
    --security-groups sg-xxxxxxxxx \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4

# Create target group
aws elbv2 create-target-group \
    --name buildvive-targets \
    --protocol HTTP \
    --port 3000 \
    --vpc-id vpc-xxxxxxxxx \
    --target-type instance \
    --health-check-path / \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3
```

## 🚀 **Step 6: Environment Variables Setup**

### 6.1 Create .env file on EC2
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Create .env file
cat > /home/ec2-user/buildvive/.env << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:YourSecurePassword123!@your-rds-endpoint:5432/buildvive

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=buildvive-uploads-$(date +%s)

# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USERNAME=your-email@buildvive.com
SMTP_PASSWORD=your-email-password
ADMIN_EMAILS=admin@buildvive.com
FROM_EMAIL=noreply@buildvive.com

# OpenAI Configuration
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4o-mini

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number

# VAPI Configuration
VAPI_API_KEY=your-vapi-key

# App Configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
EOF
```

## 🚀 **Step 7: Deploy Application**

### 7.1 Upload Code to EC2
```bash
# From your local machine, upload the code
scp -i your-key.pem -r ./website ec2-user@your-ec2-ip:/home/ec2-user/buildvive/

# SSH into EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Navigate to app directory
cd /home/ec2-user/buildvive/website

# Install dependencies
npm install

# Build the application
npm run build

# Start the application with PM2
pm2 start npm --name "buildvive" -- start
pm2 save
pm2 startup
```

### 7.2 Docker Deployment (Alternative)
```bash
# Build and run with Docker
docker build -t buildvive-renovations .
docker run -d --name buildvive-app -p 3000:3000 --env-file .env buildvive-renovations
```

## 🚀 **Step 8: Set Up SSL Certificate (Optional)**

### 8.1 Request SSL Certificate
```bash
# Request certificate from AWS Certificate Manager
aws acm request-certificate \
    --domain-name your-domain.com \
    --validation-method DNS \
    --subject-alternative-names www.your-domain.com
```

### 8.2 Configure Route 53 (Optional)
```bash
# Create hosted zone
aws route53 create-hosted-zone \
    --name your-domain.com \
    --caller-reference $(date +%s)

# Create A record pointing to your ALB
aws route53 change-resource-record-sets \
    --hosted-zone-id Z1234567890 \
    --change-batch file://dns-change.json
```

## 🚀 **Step 9: Monitoring and Logging**

### 9.1 Set Up CloudWatch
```bash
# Create CloudWatch log group
aws logs create-log-group \
    --log-group-name /aws/ec2/buildvive

# Create CloudWatch alarm for CPU
aws cloudwatch put-metric-alarm \
    --alarm-name "BuildVive High CPU" \
    --alarm-description "Alarm when CPU exceeds 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2
```

## 🚀 **Step 10: Backup Strategy**

### 10.1 RDS Automated Backups
```bash
# Enable automated backups (already enabled in RDS creation)
# Backup retention period: 7 days
# Backup window: 03:00-04:00 UTC
# Maintenance window: sun:04:00-sun:05:00 UTC
```

### 10.2 S3 Lifecycle Policy
```bash
# Create lifecycle policy for S3
aws s3api put-bucket-lifecycle-configuration \
    --bucket buildvive-uploads-$(date +%s) \
    --lifecycle-configuration file://lifecycle-policy.json
```

## 📊 **Cost Estimation (Monthly)**

| Service | Configuration | Estimated Cost |
|---------|---------------|----------------|
| EC2 t3.medium | 24/7 | ~$30 |
| RDS db.t3.micro | 24/7 | ~$15 |
| S3 Storage | 10GB | ~$0.25 |
| Data Transfer | 100GB | ~$9 |
| **Total** | | **~$55/month** |

## 🔧 **Troubleshooting**

### Common Issues:

1. **Database Connection Issues**
   - Check security groups
   - Verify RDS endpoint
   - Check database credentials

2. **S3 Upload Issues**
   - Verify IAM permissions
   - Check bucket policy
   - Verify AWS credentials

3. **Application Not Starting**
   - Check PM2 logs: `pm2 logs buildvive`
   - Verify environment variables
   - Check port 3000 is accessible

### Useful Commands:
```bash
# Check application status
pm2 status

# View logs
pm2 logs buildvive

# Restart application
pm2 restart buildvive

# Check database connection
psql -h your-rds-endpoint -U postgres -d buildvive

# Test S3 access
aws s3 ls s3://your-bucket-name
```

## 🎯 **Next Steps**

1. Set up monitoring and alerting
2. Configure automated backups
3. Set up CI/CD pipeline
4. Implement security best practices
5. Set up staging environment

## 📞 **Support**

For issues or questions:
- Check AWS documentation
- Review application logs
- Contact AWS support if needed

---

**Note**: Replace placeholder values (like `your-domain.com`, `your-key.pem`, etc.) with your actual values.
