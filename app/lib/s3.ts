import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class S3Service {
  private client: S3Client | null = null;
  private bucketName: string | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const accessKey = process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_KEY;
    const region = process.env.AWS_REGION || process.env.S3_REGION || 'us-east-1';
    const bucketName = process.env.S3_BUCKET_NAME || process.env.S3_BUCKET || 'buildvive-uploads';
    
    if (accessKey && secretKey) {
      this.client = new S3Client({
        region: region,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
        },
      });
      this.bucketName = bucketName;
    }
  }

  async uploadFile(key: string, file: Buffer, contentType: string): Promise<string> {
    if (!this.client || !this.bucketName) {
      throw new Error('S3 not configured. Please set AWS credentials and S3_BUCKET_NAME or S3_BUCKET.');
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this.client.send(command);
    const region = process.env.AWS_REGION || process.env.S3_REGION || 'us-east-1';
    return `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;
  }

  async getFileUrl(key: string): Promise<string> {
    if (!this.client || !this.bucketName) {
      throw new Error('S3 not configured. Please set AWS credentials and S3_BUCKET_NAME or S3_BUCKET.');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.client, command, { expiresIn: 3600 }); // 1 hour
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.client || !this.bucketName) {
      throw new Error('S3 not configured. Please set AWS credentials and S3_BUCKET_NAME or S3_BUCKET.');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.client.send(command);
  }

  isConfigured(): boolean {
    return this.client !== null && this.bucketName !== null;
  }
}

export const s3 = new S3Service();
