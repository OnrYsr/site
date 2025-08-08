import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bannerSchema = z.object({
  title: z.string().min(1, 'Banner başlığı gereklidir').trim(),
  subtitle: z.string().optional().nullable(),
  image: z.string().min(1, 'Banner görseli gereklidir').trim(),
  link: z.string().url().optional().nullable(),
  type: z.enum(['HERO', 'FEATURED_PRODUCTS']).optional().default('HERO'),
  isActive: z.boolean().optional().default(true),
  order: z.number().int().min(0, 'Sıralama değeri 0 veya daha büyük bir sayı olmalıdır'),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable()
});

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
    // no-op for shared prisma
  }
}

// Yeni banner oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const parseResult = bannerSchema.safeParse(await request.json());
    if (!parseResult.success) {
      const message = parseResult.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    const { title, subtitle, image, link, type, isActive, order, startDate, endDate } = parseResult.data;

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
        order: order,
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