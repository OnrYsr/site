import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { 
  checkRegisterIPRateLimit, 
  checkRegisterEmailRateLimit, 
  getClientIPFromRequest 
} from '@/lib/redis';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIPFromRequest(request);
    
    const { name, email, password } = await request.json();

    // Basic validation first
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurmanız gerekiyor' },
        { status: 400 }
      );
    }

    // Check IP rate limit (5 registrations per hour)
    const ipLimit = await checkRegisterIPRateLimit(clientIP);
    if (!ipLimit.allowed) {
      const resetHours = Math.ceil((ipLimit.resetTime - Date.now()) / (1000 * 60 * 60));
      return NextResponse.json(
        { 
          error: `IP adresiniz ${resetHours} saat boyunca kayıt yapmaktan engellendi. Saatte en fazla 5 kayıt yapabilirsiniz.`,
          rateLimited: true,
          resetTime: ipLimit.resetTime,
          reason: 'IP_BLOCKED'
        },
        { status: 429 }
      );
    }

    // Check email rate limit (1 registration per day per email)
    const emailLimit = await checkRegisterEmailRateLimit(email);
    if (!emailLimit.allowed) {
      const resetHours = Math.ceil((emailLimit.resetTime - Date.now()) / (1000 * 60 * 60));
      return NextResponse.json(
        { 
          error: `Bu email adresi ile ${resetHours} saat boyunca yeni kayıt yapamazsınız.`,
          rateLimited: true,
          resetTime: emailLimit.resetTime,
          reason: 'EMAIL_BLOCKED'
        },
        { status: 429 }
      );
    }

    // Additional validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Check if this is the first user (make them admin)
    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: isFirstUser ? 'ADMIN' : 'USER', // İlk kullanıcı admin olur
      },
    });

    // Return success response (don't include password)
    const { password: _, ...userWithoutPassword } = user;
    
    const message = isFirstUser 
      ? 'Kayıt başarılı! İlk kullanıcı olarak admin yetkileriniz var. Giriş yapabilirsiniz.'
      : 'Kayıt başarılı! Giriş yapabilirsiniz.';
    
    return NextResponse.json(
      { 
        message,
        user: userWithoutPassword,
        isAdmin: isFirstUser,
        rateLimitInfo: {
          ipRemaining: ipLimit.remainingAttempts,
          emailRemaining: emailLimit.remainingAttempts
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Register error:', error);
    
    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes('RATE_LIMIT')) {
      return NextResponse.json(
        { error: 'Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Kayıt sırasında bir hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 