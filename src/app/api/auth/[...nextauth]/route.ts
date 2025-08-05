import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { 
  checkIPRateLimit, 
  checkEmailRateLimit, 
  resetRateLimits, 
  getClientIP 
} from '@/lib/redis';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Development: Bypass rate limiting for now
          // TODO: Re-enable for production
          /*
          // Get client IP
          const clientIP = getClientIP(req as any);
          
          // Check IP rate limit
          const ipLimit = await checkIPRateLimit(clientIP);
          if (!ipLimit.allowed) {
            const resetMinutes = Math.ceil((ipLimit.resetTime - Date.now()) / (1000 * 60));
            throw new Error(`IP_BLOCKED:${resetMinutes}`);
          }

          // Check email rate limit
          const emailLimit = await checkEmailRateLimit(credentials.email);
          if (!emailLimit.allowed) {
            const resetMinutes = Math.ceil((emailLimit.resetTime - Date.now()) / (1000 * 60));
            throw new Error(`EMAIL_BLOCKED:${resetMinutes}`);
          }

          // Add progressive delay
          const delay = Math.max(ipLimit.delaySeconds, emailLimit.delaySeconds);
          if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay * 1000));
          }
          */

          // Check user credentials
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user) {
            const passwordMatch = await bcrypt.compare(credentials.password, user.password);
            
            if (passwordMatch) {
              // Development: Bypass rate limit reset
              // await resetRateLimits(clientIP, credentials.email);
              
              return { 
                id: user.id, 
                name: user.name || '', 
                email: user.email,
                role: user.role 
              };
            }
          }
          
          // Invalid credentials - rate limits already incremented
          throw new Error('INVALID_CREDENTIALS');
          
        } catch (error) {
          console.error('Auth error:', error);
          
          // Re-throw rate limit errors
          if (error instanceof Error && error.message.startsWith('IP_BLOCKED:')) {
            throw error;
          }
          if (error instanceof Error && error.message.startsWith('EMAIL_BLOCKED:')) {
            throw error;
          }
          
          // For other errors, just return null (invalid credentials)
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If URL is provided and starts with baseUrl, use it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // For admin login, redirect to admin panel
      if (url.includes('/admin')) {
        return baseUrl + '/admin';
      }
      
      // Otherwise redirect to home page
      return baseUrl + '/';
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 