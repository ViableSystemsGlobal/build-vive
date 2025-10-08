// Storage service that can switch between different storage options
import { kv } from '@vercel/kv';
import { createClient } from 'redis';
import { database } from './database';

export type StorageType = 'database' | 'kv' | 'file' | 'memory';

class StorageService {
  private storageType: StorageType;
  private memoryCache: Map<string, any> = new Map();

  constructor() {
    // Auto-detect storage type based on environment
    if (database.isConfigured()) {
      this.storageType = 'database';
    } else if (process.env.REDIS_URL || process.env.KV_REST_API_URL) {
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
        case 'database':
          const result = await database.query(
            'SELECT data FROM homepage_data WHERE id = 1 ORDER BY updated_at DESC LIMIT 1'
          );
          return result.rows[0]?.data || null;
        
        case 'kv':
          if (process.env.REDIS_URL) {
            // Use direct Redis connection
            const client = createClient({ url: process.env.REDIS_URL });
            await client.connect();
            const data = await client.get(key);
            await client.disconnect();
            return data ? JSON.parse(data) : null;
          } else {
            // Use Vercel KV
            const kvData = await kv.get(key);
            return kvData ? JSON.parse(kvData as string) : null;
          }
        
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
        case 'database':
          await database.query(
            'INSERT INTO homepage_data (data) VALUES ($1) ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW()',
            [JSON.stringify(value)]
          );
          return true;
        
        case 'kv':
          if (process.env.REDIS_URL) {
            // Use direct Redis connection
            const client = createClient({ url: process.env.REDIS_URL });
            await client.connect();
            await client.set(key, JSON.stringify(value));
            await client.disconnect();
            return true;
          } else {
            // Use Vercel KV
            await kv.set(key, JSON.stringify(value));
            return true;
          }
        
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
        case 'database':
          await database.query('DELETE FROM homepage_data WHERE id = 1');
          return true;
        
        case 'kv':
          if (process.env.REDIS_URL) {
            // Use direct Redis connection
            const client = createClient({ url: process.env.REDIS_URL });
            await client.connect();
            await client.del(key);
            await client.disconnect();
            return true;
          } else {
            // Use Vercel KV
            await kv.del(key);
            return true;
          }
        
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
