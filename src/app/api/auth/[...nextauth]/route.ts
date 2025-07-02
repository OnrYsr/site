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
        console.log('Authorization attempt for:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log('User found:', user ? 'Yes' : 'No');

          if (user) {
            const passwordMatch = await bcrypt.compare(credentials.password, user.password);
            console.log('Password match:', passwordMatch);
            
            if (passwordMatch) {
              console.log('Login successful for:', user.email);
              return { 
                id: user.id, 
                name: user.name || '', 
                email: user.email,
                role: user.role 
              };
            }
          }
          
          console.log('Authentication failed');
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
      // Her zaman anasayfaya yönlendir
      return baseUrl + '/';
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 