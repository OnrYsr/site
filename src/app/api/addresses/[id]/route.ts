import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Belirli bir adresi getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const address = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Adres bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error('Adres getirilirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Adres getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT: Adresi güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Eğer varsayılan adres olarak işaretleniyorsa, diğer adresleri varsayılan olmaktan çıkar
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          id: { not: params.id },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.update({
      where: {
        id: params.id,
      },
      data: {
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
    console.error('Adres güncellenirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Adres güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE: Adresi sil
export async function DELETE(
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

    await prisma.address.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Adres başarıyla silindi',
    });
  } catch (error) {
    console.error('Adres silinirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Adres silinirken hata oluştu' },
      { status: 500 }
    );
  }
} 