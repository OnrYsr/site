import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Kullanıcının adreslerini listele
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error('Adresler listelenirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Adresler yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST: Yeni adres ekle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      type,
      firstName,
      lastName,
      company,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault = false,
    } = body;

    // Zorunlu alanları kontrol et
    if (!firstName || !lastName || !address1 || !city || !postalCode) {
      return NextResponse.json(
        { success: false, error: 'Zorunlu alanları doldurun' },
        { status: 400 }
      );
    }

    // Eğer varsayılan adres olarak işaretleniyorsa, diğer adresleri varsayılan olmaktan çıkar
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        type: type || 'SHIPPING',
        firstName,
        lastName,
        company: company || null,
        address1,
        address2: address2 || null,
        city,
        state: state || city,
        postalCode,
        country: country || 'Turkey',
        phone: phone || null,
        isDefault,
      },
    });

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error('Adres eklenirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Adres eklenirken hata oluştu' },
      { status: 500 }
    );
  }
} 