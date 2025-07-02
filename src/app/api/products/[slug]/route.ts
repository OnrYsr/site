import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { 
        slug,
        isActive: true 
      },
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
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    const activeDiscount = product.discounts[0];
    const reviewsCount = product.reviews.length;
    const averageRating = reviewsCount > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount 
      : 0;

    const formattedProduct = {
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
      isNew: product.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      reviewsList: product.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        userName: review.user.name,
        createdAt: review.createdAt
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: formattedProduct
    });

  } catch (error) {
    console.error('Product Detail API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Ürün detayları yüklenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 