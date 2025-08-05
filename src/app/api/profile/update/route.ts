import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: Kullanıcı profil bilgilerini güncelle
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstName, lastName, email } = await request.json();

    // Validasyon
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Ad, soyad ve email alanları zorunludur' },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    // Email benzersizlik kontrolü (kendi email'i hariç)
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        id: { not: session.user.id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi başka bir kullanıcı tarafından kullanılıyor' },
        { status: 400 }
      );
    }

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        firstName,
        lastName,
        email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profil bilgileri başarıyla güncellendi',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profil güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Profil güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
} 