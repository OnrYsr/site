import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurmanız gerekiyor' },
        { status: 400 }
      );
    }

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
        isAdmin: isFirstUser
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Kayıt sırasında bir hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 