import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user) {
            const passwordMatch = await bcrypt.compare(credentials.password, user.password);
            
            if (passwordMatch) {
              return { 
                id: user.id, 
                name: user.name || '', 
                email: user.email,
                role: user.role 
              };
            }
          }
          
          return null;
        } catch (error) {
          console.error('Database error during auth:', error);
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
      
      // Otherwise redirect to home page
      return baseUrl + '/';
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 