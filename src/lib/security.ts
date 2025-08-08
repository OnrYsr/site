import { z } from 'zod';

// Input sanitization utility
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// SQL Injection prevention (for dynamic queries)
export function escapeSqlValue(value: string): string {
  if (typeof value !== 'string') {
    return '';
  }
  
  return value
    .replace(/'/g, "''") // Escape single quotes
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/%/g, '\\%') // Escape LIKE wildcards
    .replace(/_/g, '\\_'); // Escape LIKE wildcards
}

// XSS Prevention
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  const htmlEscapes: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return text.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
}

// Rate limiting helper
export function isRateLimited(
  attempts: number,
  maxAttempts: number,
  windowMs: number,
  lastAttempt: number
): boolean {
  const now = Date.now();
  const timeWindow = now - windowMs;
  
  if (lastAttempt < timeWindow) {
    return false; // Reset if outside window
  }
  
  return attempts >= maxAttempts;
}

// Password strength validation
export const passwordSchema = z
  .string()
  .min(8, 'Şifre en az 8 karakter olmalıdır')
  .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
  .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
  .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir')
  .regex(/[^A-Za-z0-9]/, 'Şifre en az bir özel karakter içermelidir');

// Email validation
export const emailSchema = z
  .string()
  .email('Geçerli bir email adresi giriniz')
  .max(254, 'Email adresi çok uzun');

// File upload validation
export const fileUploadSchema = z.object({
  name: z.string().min(1, 'Dosya adı gereklidir'),
  size: z.number().max(5 * 1024 * 1024, 'Dosya boyutu 5MB\'dan küçük olmalıdır'), // 5MB
  type: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(type),
    'Sadece JPEG, PNG, WebP ve SVG dosyaları kabul edilir'
  )
});

// CSRF Token validation
export function validateCsrfToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) {
    return false;
  }
  
  // Timing attack prevention
  if (token.length !== sessionToken.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ sessionToken.charCodeAt(i);
  }
  
  return result === 0;
}

// Session validation
export function validateSession(session: any): boolean {
  if (!session || !session.user || !session.user.id) {
    return false;
  }
  
  // Check if session is not expired (24 hours)
  const sessionAge = Date.now() - (session.user.createdAt || 0);
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  return sessionAge < maxAge;
}

// Admin role validation
export function isAdmin(session: any): boolean {
  return validateSession(session) && session.user.role === 'ADMIN';
}

// User can access resource validation
export function canAccessResource(session: any, resourceUserId: string): boolean {
  return validateSession(session) && (
    session.user.role === 'ADMIN' || 
    session.user.id === resourceUserId
  );
}
