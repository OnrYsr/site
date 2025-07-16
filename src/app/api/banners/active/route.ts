import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Aktif banner'ları getir (frontend için)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'HERO' veya 'FEATURED_PRODUCTS'
    const now = new Date();
    
    const whereCondition: any = {
      isActive: true,
      OR: [
        {
          AND: [
            { startDate: { lte: now } },
            { endDate: { gte: now } }
          ]
        },
        {
          AND: [
            { startDate: null },
            { endDate: null }
          ]
        },
        {
          AND: [
            { startDate: { lte: now } },
            { endDate: null }
          ]
        },
        {
          AND: [
            { startDate: null },
            { endDate: { gte: now } }
          ]
        }
      ]
    };

    // Type parametresi varsa ekle
    if (type && (type === 'HERO' || type === 'FEATURED_PRODUCTS')) {
      whereCondition.type = type;
    }
    
    const banners = await prisma.banner.findMany({
      where: whereCondition,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        subtitle: true,
        image: true,
        link: true,
        type: true,
        order: true
      }
    });

    return NextResponse.json({
      success: true,
      data: banners,
      count: banners.length
    });

  } catch (error) {
    console.error('Active banners API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Aktif banner\'lar yüklenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 