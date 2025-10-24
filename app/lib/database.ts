import { Pool, PoolClient } from 'pg';
import Database from 'better-sqlite3';

// Database connection pool
let pool: Pool | null = null;
let sqliteDb: Database.Database | null = null;

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

class DatabaseService {
  private config: DatabaseConfig | null = null;

  constructor() {
    this.initializeConfig();
  }

  private initializeConfig() {
    if (process.env.DATABASE_URL) {
      // Check if it's a SQLite file URL
      if (process.env.DATABASE_URL.startsWith('file:')) {
        // SQLite database - no config needed for PostgreSQL
        this.config = null;
        return;
      }
      
      // Parse DATABASE_URL (format: postgresql://username:password@host:port/database)
      const url = new URL(process.env.DATABASE_URL);
      this.config = {
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1), // Remove leading slash
        username: url.username,
        password: url.password,
        ssl: process.env.NODE_ENV === 'production'
      };
    } else if (process.env.DB_HOST) {
      // Individual environment variables
      this.config = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'buildvive',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
        ssl: process.env.NODE_ENV === 'production'
      };
    }
  }

  private getPool(): Pool {
    if (!pool && this.config) {
      pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.username,
        password: this.config.password,
        ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
      });
    }
    return pool!;
  }

  private getSqliteDb(): Database.Database {
    if (!sqliteDb && process.env.DATABASE_URL?.startsWith('file:')) {
      const dbPath = process.env.DATABASE_URL.replace('file:', '');
      sqliteDb = new Database(dbPath);
    }
    return sqliteDb!;
  }

  async query(text: string, params?: any[]): Promise<any> {
    // Check if using SQLite
    if (process.env.DATABASE_URL?.startsWith('file:')) {
      const db = this.getSqliteDb();
      const stmt = db.prepare(text);
      const result = stmt.all(params || []);
      return { rows: result };
    }

    // PostgreSQL
    if (!this.config) {
      throw new Error('Database not configured. Please set DATABASE_URL or individual DB environment variables.');
    }

    const client = await this.getPool().connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    if (!this.config) {
      throw new Error('Database not configured. Please set DATABASE_URL or individual DB environment variables.');
    }

    const client = await this.getPool().connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async initializeTables(): Promise<void> {
    // Check if using SQLite
    if (process.env.DATABASE_URL?.startsWith('file:')) {
      try {
        // Create homepage_data table (SQLite version)
        await this.query(`
          CREATE TABLE IF NOT EXISTS homepage_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create quotes table (SQLite version)
        await this.query(`
          CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create chat_history table (SQLite version)
        await this.query(`
          CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create knowledge_base table (SQLite version)
        await this.query(`
          CREATE TABLE IF NOT EXISTS knowledge_base (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        console.log('SQLite database tables initialized successfully');
      } catch (error) {
        console.error('Error initializing SQLite database tables:', error);
        throw error;
      }
      return;
    }

    // PostgreSQL initialization
    if (!this.config) {
      console.log('Database not configured, skipping table initialization');
      return;
    }

    try {
      // Create homepage_data table
      await this.query(`
        CREATE TABLE IF NOT EXISTS homepage_data (
          id SERIAL PRIMARY KEY,
          data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create quotes table
      await this.query(`
        CREATE TABLE IF NOT EXISTS quotes (
          id SERIAL PRIMARY KEY,
          data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create chat_history table
      await this.query(`
        CREATE TABLE IF NOT EXISTS chat_history (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create knowledge_base table
      await this.query(`
        CREATE TABLE IF NOT EXISTS knowledge_base (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          category VARCHAR(100),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      console.log('PostgreSQL database tables initialized successfully');
    } catch (error) {
      console.error('Error initializing database tables:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (pool) {
      await pool.end();
      pool = null;
    }
  }

  isConfigured(): boolean {
    // Check if using SQLite
    if (process.env.DATABASE_URL?.startsWith('file:')) {
      return true;
    }
    // Check PostgreSQL config
    return this.config !== null;
  }
}

export const database = new DatabaseService();
