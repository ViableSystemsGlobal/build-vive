import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class S3Service {
  private client: S3Client | null = null;
  private bucketName: string | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      this.client = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
      this.bucketName = process.env.S3_BUCKET_NAME || 'buildvive-uploads';
    }
  }

  async uploadFile(key: string, file: Buffer, contentType: string): Promise<string> {
    if (!this.client || !this.bucketName) {
      throw new Error('S3 not configured. Please set AWS credentials and S3_BUCKET_NAME.');
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this.client.send(command);
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  }

  async getFileUrl(key: string): Promise<string> {
    if (!this.client || !this.bucketName) {
      throw new Error('S3 not configured. Please set AWS credentials and S3_BUCKET_NAME.');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.client, command, { expiresIn: 3600 }); // 1 hour
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.client || !this.bucketName) {
      throw new Error('S3 not configured. Please set AWS credentials and S3_BUCKET_NAME.');
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
