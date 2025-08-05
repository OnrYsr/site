import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: Adresi varsayılan yap
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Adresin kullanıcıya ait olduğunu kontrol et
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { success: false, error: 'Adres bulunamadı' },
        { status: 404 }
      );
    }

    // Diğer tüm adresleri varsayılan olmaktan çıkar
    await prisma.address.updateMany({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    // Bu adresi varsayılan yap
    const address = await prisma.address.update({
      where: {
        id: params.id,
      },
      data: {
        isDefault: true,
      },
    });

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error('Varsayılan adres ayarlanırken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Varsayılan adres ayarlanırken hata oluştu' },
      { status: 500 }
    );
  }
} 