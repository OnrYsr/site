import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tüm banner'ları getir
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    const formattedBanners = banners.map(banner => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      type: banner.type,
      isActive: banner.isActive,
      order: banner.order,
      startDate: banner.startDate,
      endDate: banner.endDate,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedBanners,
      count: formattedBanners.length
    });

  } catch (error) {
    console.error('Banners API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Banner\'lar yüklenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Yeni banner oluştur
export async function POST(request: NextRequest) {
  try {
    const { title, subtitle, image, link, type, isActive, order, startDate, endDate } = await request.json();

    // Validation
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Banner başlığı gereklidir' },
        { status: 400 }
      );
    }

    if (!image?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Banner görseli gereklidir' },
        { status: 400 }
      );
    }

    // Type validation
    if (type && !['HERO', 'FEATURED_PRODUCTS'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz banner tipi' },
        { status: 400 }
      );
    }

    // Order validation
    const orderValue = Number(order);
    if (isNaN(orderValue) || orderValue < 0) {
      return NextResponse.json(
        { success: false, error: 'Sıralama değeri 0 veya daha büyük bir sayı olmalıdır' },
        { status: 400 }
      );
    }

    // Date validation
    let parsedStartDate = null;
    let parsedEndDate = null;

    if (startDate) {
      parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Geçersiz başlangıç tarihi' },
          { status: 400 }
        );
      }
    }

    if (endDate) {
      parsedEndDate = new Date(endDate);
      if (isNaN(parsedEndDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Geçersiz bitiş tarihi' },
          { status: 400 }
        );
      }
    }

    if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
      return NextResponse.json(
        { success: false, error: 'Başlangıç tarihi bitiş tarihinden önce olmalıdır' },
        { status: 400 }
      );
    }

    // Banner oluştur
    const banner = await prisma.banner.create({
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        image: image.trim(),
        link: link?.trim() || null,
        type: type || 'HERO',
        isActive: isActive !== undefined ? isActive : true,
        order: orderValue,
        startDate: parsedStartDate,
        endDate: parsedEndDate
      }
    });

    const formattedBanner = {
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      type: banner.type,
      isActive: banner.isActive,
      order: banner.order,
      startDate: banner.startDate,
      endDate: banner.endDate,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Banner başarıyla oluşturuldu',
      data: formattedBanner
    }, { status: 201 });

  } catch (error) {
    console.error('Create banner error:', error);
    return NextResponse.json(
      { success: false, error: 'Banner oluşturulurken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 