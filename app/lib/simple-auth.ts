import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  permissions: string[];
}

// Default admin user
const DEFAULT_ADMIN: User = {
  id: '1',
  email: 'admin@buildvive.local',
  name: 'Admin User',
  role: 'admin',
  permissions: ['read', 'write', 'delete', 'admin']
};

export class SimpleAuthService {
  // Authenticate user
  static async authenticate(email: string, password: string): Promise<User | null> {
    // For now, using hardcoded admin (in production, query database)
    if (email === DEFAULT_ADMIN.email && password === 'admin123') {
      return DEFAULT_ADMIN;
    }
    return null;
  }

  // Set simple session cookies
  static async setSessionCookies(user: User): Promise<void> {
    const cookieStore = await cookies();
    
    // Set admin logged in flag
    cookieStore.set('admin_logged_in', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
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

    // Set session timestamp
    cookieStore.set('session_timestamp', Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  // Clear session cookies
  static async clearSessionCookies(): Promise<void> {
    const cookieStore = await cookies();
    
    cookieStore.delete('admin_logged_in');
    cookieStore.delete('user_info');
    cookieStore.delete('session_timestamp');
  }

  // Get current user from cookies
  static async getCurrentUser(): Promise<User | null> {
    try {
      const cookieStore = await cookies();
      const isLoggedIn = cookieStore.get('admin_logged_in')?.value;
      const userInfo = cookieStore.get('user_info')?.value;
      const sessionTimestamp = cookieStore.get('session_timestamp')?.value;
      
      if (!isLoggedIn || !userInfo || !sessionTimestamp) {
        return null;
      }

      // Check if session is expired (24 hours)
      const sessionTime = parseInt(sessionTimestamp);
      const now = Date.now();
      const sessionAge = now - sessionTime;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (sessionAge > maxAge) {
        // Session expired, clear cookies
        await this.clearSessionCookies();
        return null;
      }

      const user = JSON.parse(userInfo);
      return user;
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

  // Hash password (for future use)
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // Verify password (for future use)
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
