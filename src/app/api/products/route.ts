import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'featured';
    const featured = searchParams.get('featured');

    // Base query
    const where: any = {
      isActive: true
    };

    // Kategori filtresi
    if (category && category !== 'all') {
      const categoryData = await prisma.category.findUnique({
        where: { slug: category }
      });
      if (categoryData) {
        where.categoryId = categoryData.id;
      }
    }

    // Arama filtresi
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Öne çıkan ürünler filtresi
    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Sıralama
    let orderBy: any = {};
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      default:
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        discounts: {
          where: {
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() }
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    });

    // Ürünleri frontend formatına çevir
    const formattedProducts = products.map(product => {
      const activeDiscount = product.discounts[0];
      const reviewsCount = product.reviews.length;
      const averageRating = reviewsCount > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount 
        : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        images: product.images,
        stock: product.stock,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        category: product.category.name,
        categorySlug: product.category.slug,
        rating: Math.round(averageRating * 10) / 10,
        reviews: reviewsCount,
        discount: activeDiscount ? activeDiscount.percentage : null,
        badgeText: activeDiscount?.badgeText || null,
        badgeColor: activeDiscount?.badgeColor || null,
        isNew: product.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Son 30 gün
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      count: formattedProducts.length
    });

  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Ürünler yüklenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 