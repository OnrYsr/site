import { createClient } from 'redis';

// Redis client configuration
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Connect on first use
let isConnected = false;

export async function getRedisClient() {
  if (!isConnected) {
    await redisClient.connect();
    isConnected = true;
  }
  return redisClient;
}

// Rate limiting configuration
export const RATE_LIMITS = {
  IP_ATTEMPTS: 5,           // Max attempts per IP
  IP_WINDOW: 15 * 60,       // 15 minutes in seconds
  EMAIL_ATTEMPTS: 3,        // Max attempts per email
  EMAIL_WINDOW: 30 * 60,    // 30 minutes in seconds
  PROGRESSIVE_DELAY: [0, 2, 5, 10, 30], // Seconds delay for each attempt
  
  // Register specific limits
  REGISTER_IP_ATTEMPTS: 5,     // Max registrations per IP per hour
  REGISTER_IP_WINDOW: 60 * 60, // 1 hour in seconds
  REGISTER_EMAIL_ATTEMPTS: 1,  // Max registrations per email per day
  REGISTER_EMAIL_WINDOW: 24 * 60 * 60, // 24 hours in seconds
};

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: number;
  delaySeconds: number;
  reason?: string;
}

// Check and update rate limit for IP
export async function checkIPRateLimit(ip: string): Promise<RateLimitResult> {
  const redis = await getRedisClient();
  const key = `ip_attempts:${ip}`;
  
  const attempts = await redis.get(key);
  const currentAttempts = attempts ? parseInt(attempts) : 0;
  
  if (currentAttempts >= RATE_LIMITS.IP_ATTEMPTS) {
    const ttl = await redis.ttl(key);
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: Date.now() + (ttl * 1000),
      delaySeconds: 0,
      reason: 'IP_BLOCKED'
    };
  }
  
  // Increment attempts
  await redis.setEx(key, RATE_LIMITS.IP_WINDOW, (currentAttempts + 1).toString());
  
  return {
    allowed: true,
    remainingAttempts: RATE_LIMITS.IP_ATTEMPTS - currentAttempts - 1,
    resetTime: Date.now() + (RATE_LIMITS.IP_WINDOW * 1000),
    delaySeconds: RATE_LIMITS.PROGRESSIVE_DELAY[Math.min(currentAttempts, RATE_LIMITS.PROGRESSIVE_DELAY.length - 1)] || 0
  };
}

// Check and update rate limit for email
export async function checkEmailRateLimit(email: string): Promise<RateLimitResult> {
  const redis = await getRedisClient();
  const key = `email_attempts:${email.toLowerCase()}`;
  
  const attempts = await redis.get(key);
  const currentAttempts = attempts ? parseInt(attempts) : 0;
  
  if (currentAttempts >= RATE_LIMITS.EMAIL_ATTEMPTS) {
    const ttl = await redis.ttl(key);
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: Date.now() + (ttl * 1000),
      delaySeconds: 0,
      reason: 'EMAIL_BLOCKED'
    };
  }
  
  // Increment attempts
  await redis.setEx(key, RATE_LIMITS.EMAIL_WINDOW, (currentAttempts + 1).toString());
  
  return {
    allowed: true,
    remainingAttempts: RATE_LIMITS.EMAIL_ATTEMPTS - currentAttempts - 1,
    resetTime: Date.now() + (RATE_LIMITS.EMAIL_WINDOW * 1000),
    delaySeconds: RATE_LIMITS.PROGRESSIVE_DELAY[Math.min(currentAttempts, RATE_LIMITS.PROGRESSIVE_DELAY.length - 1)] || 0
  };
}

// Check and update rate limit for registration IP
export async function checkRegisterIPRateLimit(ip: string): Promise<RateLimitResult> {
  const redis = await getRedisClient();
  const key = `register_ip:${ip}`;
  
  const attempts = await redis.get(key);
  const currentAttempts = attempts ? parseInt(attempts) : 0;
  
  if (currentAttempts >= RATE_LIMITS.REGISTER_IP_ATTEMPTS) {
    const ttl = await redis.ttl(key);
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: Date.now() + (ttl * 1000),
      delaySeconds: 0,
      reason: 'REGISTER_IP_BLOCKED'
    };
  }
  
  // Increment attempts
  await redis.setEx(key, RATE_LIMITS.REGISTER_IP_WINDOW, (currentAttempts + 1).toString());
  
  return {
    allowed: true,
    remainingAttempts: RATE_LIMITS.REGISTER_IP_ATTEMPTS - currentAttempts - 1,
    resetTime: Date.now() + (RATE_LIMITS.REGISTER_IP_WINDOW * 1000),
    delaySeconds: 0
  };
}

// Check and update rate limit for registration email
export async function checkRegisterEmailRateLimit(email: string): Promise<RateLimitResult> {
  const redis = await getRedisClient();
  const key = `register_email:${email.toLowerCase()}`;
  
  const attempts = await redis.get(key);
  const currentAttempts = attempts ? parseInt(attempts) : 0;
  
  if (currentAttempts >= RATE_LIMITS.REGISTER_EMAIL_ATTEMPTS) {
    const ttl = await redis.ttl(key);
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: Date.now() + (ttl * 1000),
      delaySeconds: 0,
      reason: 'REGISTER_EMAIL_BLOCKED'
    };
  }
  
  // Increment attempts
  await redis.setEx(key, RATE_LIMITS.REGISTER_EMAIL_WINDOW, (currentAttempts + 1).toString());
  
  return {
    allowed: true,
    remainingAttempts: RATE_LIMITS.REGISTER_EMAIL_ATTEMPTS - currentAttempts - 1,
    resetTime: Date.now() + (RATE_LIMITS.REGISTER_EMAIL_WINDOW * 1000),
    delaySeconds: 0
  };
}

// Reset rate limits on successful login
export async function resetRateLimits(ip: string, email: string): Promise<void> {
  const redis = await getRedisClient();
  await Promise.all([
    redis.del(`ip_attempts:${ip}`),
    redis.del(`email_attempts:${email.toLowerCase()}`)
  ]);
}

// Reset registration rate limits on successful registration
export async function resetRegisterRateLimits(ip: string, email: string): Promise<void> {
  const redis = await getRedisClient();
  // Don't reset IP limit (keep per-hour restriction)
  // Only reset email limit if needed (though it's 1 per day anyway)
  await redis.del(`register_email:${email.toLowerCase()}`);
}

// Get client IP from NextAuth request object
export function getClientIP(req: any): string {
  // NextAuth request object structure
  const headers = req?.headers || {};
  
  // Try different header formats
  const forwarded = headers['x-forwarded-for'] || headers.get?.('x-forwarded-for');
  const realIP = headers['x-real-ip'] || headers.get?.('x-real-ip');
  const remoteAddress = req?.connection?.remoteAddress || req?.socket?.remoteAddress;
  
  if (forwarded) {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return ip.split(',')[0].trim();
  }
  
  if (realIP) {
    return Array.isArray(realIP) ? realIP[0] : realIP;
  }
  
  if (remoteAddress) {
    return remoteAddress;
  }
  
  // Fallback for local development
  return '127.0.0.1';
}

// Get client IP from Next.js request
export function getClientIPFromRequest(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback for local development
  return '127.0.0.1';
} 