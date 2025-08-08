import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { 
  checkIPRateLimit, 
  checkEmailRateLimit, 
  resetRateLimits, 
  getClientIP 
} from '@/lib/redis';

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
          // Conditional rate limiting
          if (process.env.RATE_LIMIT_ENABLED === 'true') {
            const clientIP = getClientIP(req as any);

            const ipLimit = await checkIPRateLimit(clientIP);
            if (!ipLimit.allowed) {
              const resetMinutes = Math.ceil((ipLimit.resetTime - Date.now()) / (1000 * 60));
              throw new Error(`IP_BLOCKED:${resetMinutes}`);
            }

            const emailLimit = await checkEmailRateLimit(credentials.email);
            if (!emailLimit.allowed) {
              const resetMinutes = Math.ceil((emailLimit.resetTime - Date.now()) / (1000 * 60));
              throw new Error(`EMAIL_BLOCKED:${resetMinutes}`);
            }

            const delay = Math.max(ipLimit.delaySeconds, emailLimit.delaySeconds);
            if (delay > 0) {
              await new Promise(resolve => setTimeout(resolve, delay * 1000));
            }
          }

          // Check user credentials
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user) {
            const passwordMatch = await bcrypt.compare(credentials.password, user.password);
            
            if (passwordMatch) {
              if (process.env.RATE_LIMIT_ENABLED === 'true') {
                const clientIP = getClientIP(req as any);
                await resetRateLimits(clientIP, credentials.email);
              }
              
              return { 
                id: user.id, 
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '', 
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
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
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const derivedUserId = (typeof token.sub === 'string' && token.sub) || (typeof (token as any).id === 'string' && (token as any).id) || '';
        session.user.id = derivedUserId;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If URL is provided and starts with baseUrl, use it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // For external URLs, redirect to home page
      return baseUrl + '/';
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 