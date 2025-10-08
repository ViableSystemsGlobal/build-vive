import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// JWT Secret - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// Warn if using default secret in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: Using default JWT_SECRET in production! Please set JWT_SECRET environment variable.');
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  permissions: string[];
}

export interface SessionData {
  user: User;
  iat: number;
  exp: number;
}

// Default admin user (in production, this should be in database)
const DEFAULT_ADMIN: User = {
  id: '1',
  email: 'admin@aceconstruction.local',
  name: 'Admin User',
  role: 'admin',
  permissions: ['read', 'write', 'delete', 'admin']
};

export class AuthService {
  // Generate JWT token
  static generateToken(user: User): string {
    return jwt.sign(
      { 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions
        }
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  // Generate refresh token
  static generateRefreshToken(user: User): string {
    return jwt.sign(
      { 
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
  }

  // Verify JWT token
  static verifyToken(token: string): SessionData | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as SessionData;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Authenticate user
  static async authenticate(email: string, password: string): Promise<User | null> {
    // For now, using hardcoded admin (in production, query database)
    if (email === DEFAULT_ADMIN.email && password === 'admin123') {
      return DEFAULT_ADMIN;
    }
    return null;
  }

  // Set session cookies
  static async setSessionCookies(user: User): Promise<void> {
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    const cookieStore = await cookies();
    
    // Set access token cookie
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Set refresh token cookie
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Set user info cookie (for client-side access)
    cookieStore.set('user_info', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }), {
      httpOnly: false, // Client can access this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  // Clear session cookies
  static async clearSessionCookies(): Promise<void> {
    const cookieStore = await cookies();
    
    cookieStore.delete('auth_token');
    cookieStore.delete('refresh_token');
    cookieStore.delete('user_info');
    cookieStore.delete('admin_logged_in'); // Legacy cookie
  }

  // Get current user from cookies
  static async getCurrentUser(): Promise<User | null> {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;
      
      if (!token) {
        return null;
      }

      const sessionData = this.verifyToken(token);
      if (!sessionData) {
        return null;
      }

      return sessionData.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user has permission
  static hasPermission(user: User, permission: string): boolean {
    return user.permissions.includes(permission) || user.role === 'admin';
  }

  // Middleware for protecting routes
  static async requireAuth(): Promise<User> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('Authentication required');
    }
    return user;
  }

  // Middleware for admin-only routes
  static async requireAdmin(): Promise<User> {
    const user = await this.requireAuth();
    if (user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    return user;
  }
}
