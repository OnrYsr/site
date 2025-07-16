import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tek banner getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const banner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner bulunamadı' },
        { status: 404 }
      );
    }

    const formattedBanner = {
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      isActive: banner.isActive,
      order: banner.order,
      startDate: banner.startDate,
      endDate: banner.endDate,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: formattedBanner
    });

  } catch (error) {
    console.error('Banner GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Banner yüklenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Banner güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Önce banner'ın var olup olmadığını kontrol et
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!existingBanner) {
      return NextResponse.json(
        { success: false, error: 'Banner bulunamadı' },
        { status: 404 }
      );
    }

    const { title, subtitle, image, link, isActive, order, startDate, endDate } = await request.json();

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

    // Banner güncelle
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        image: image.trim(),
        link: link?.trim() || null,
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
      isActive: banner.isActive,
      order: banner.order,
      startDate: banner.startDate,
      endDate: banner.endDate,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Banner başarıyla güncellendi',
      data: formattedBanner
    });

  } catch (error) {
    console.error('Banner PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Banner güncellenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Banner sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Önce banner'ın var olup olmadığını kontrol et
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!existingBanner) {
      return NextResponse.json(
        { success: false, error: 'Banner bulunamadı' },
        { status: 404 }
      );
    }

    // Banner sil
    await prisma.banner.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Banner başarıyla silindi'
    });

  } catch (error) {
    console.error('Banner DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Banner silinirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 