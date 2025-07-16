import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedProducts = products.map(product => ({
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
      category: {
        name: product.category.name,
        slug: product.category.slug
      },
      reviewCount: product._count.reviews,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      count: formattedProducts.length
    });

  } catch (error) {
    console.error('Admin Products API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Ürünler yüklenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, slug, description, price, originalPrice, images, stock, isActive, isFeatured, categoryId } = await request.json();

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Ürün adı gereklidir' },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: 'Kategori seçilmelidir' },
        { status: 400 }
      );
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Geçerli bir fiyat girilmelidir' },
        { status: 400 }
      );
    }

    if (stock < 0) {
      return NextResponse.json(
        { success: false, error: 'Stok miktarı 0 veya daha fazla olmalıdır' },
        { status: 400 }
      );
    }

    // Kategori var mı kontrol et
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Seçilen kategori bulunamadı' },
        { status: 400 }
      );
    }

    // Slug benzersiz mi kontrol et
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Ürün oluştur
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || '',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        images: Array.isArray(images) ? images : [],
        stock: Number(stock),
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        categoryId
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

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
      category: product.category,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Ürün başarıyla oluşturuldu',
      data: formattedProduct
    }, { status: 201 });

  } catch (error) {
    console.error('Admin Product POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Ürün oluşturulurken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 