// Storage service that can switch between different storage options
import { kv } from '@vercel/kv';

export type StorageType = 'kv' | 'file' | 'memory';

class StorageService {
  private storageType: StorageType;
  private memoryCache: Map<string, any> = new Map();

  constructor() {
    // Auto-detect storage type based on environment
    if (process.env.KV_REST_API_URL) {
      this.storageType = 'kv';
    } else if (process.env.VERCEL === '1') {
      this.storageType = 'memory'; // Fallback for Vercel without KV
    } else {
      this.storageType = 'file';
    }
  }

  async get(key: string): Promise<any> {
    try {
      switch (this.storageType) {
        case 'kv':
          const kvData = await kv.get(key);
          return kvData ? JSON.parse(kvData as string) : null;
        
        case 'memory':
          return this.memoryCache.get(key) || null;
        
        case 'file':
          // File system fallback (for local development)
          const { readFile } = await import('fs/promises');
          const { join } = await import('path');
          const filePath = join(process.cwd(), 'data', `${key}.json`);
          try {
            const data = await readFile(filePath, 'utf-8');
            return JSON.parse(data);
          } catch {
            return null;
          }
        
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any): Promise<boolean> {
    try {
      switch (this.storageType) {
        case 'kv':
          await kv.set(key, JSON.stringify(value));
          return true;
        
        case 'memory':
          this.memoryCache.set(key, value);
          return true;
        
        case 'file':
          // File system fallback (for local development)
          const { writeFile, mkdir } = await import('fs/promises');
          const { join } = await import('path');
          const dataDir = join(process.cwd(), 'data');
          const filePath = join(dataDir, `${key}.json`);
          
          await mkdir(dataDir, { recursive: true });
          await writeFile(filePath, JSON.stringify(value, null, 2));
          return true;
        
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      switch (this.storageType) {
        case 'kv':
          await kv.del(key);
          return true;
        
        case 'memory':
          this.memoryCache.delete(key);
          return true;
        
        case 'file':
          // File system fallback
          const { unlink } = await import('fs/promises');
          const { join } = await import('path');
          const filePath = join(process.cwd(), 'data', `${key}.json`);
          try {
            await unlink(filePath);
            return true;
          } catch {
            return false;
          }
        
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error deleting ${key}:`, error);
      return false;
    }
  }

  getStorageType(): StorageType {
    return this.storageType;
  }
}

export const storage = new StorageService();
