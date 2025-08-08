import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Ürün adı gereklidir').trim(),
  slug: z.string().min(1, 'Slug gereklidir').trim(),
  description: z.string().optional().default(''),
  price: z.number().positive('Geçerli bir fiyat girilmelidir'),
  originalPrice: z.number().positive().optional().nullable(),
  images: z.array(z.string().url()).optional().default([]),
  stock: z.number().int().min(0, 'Stok miktarı 0 veya daha fazla olmalıdır'),
  isActive: z.boolean().optional(),
  isSaleActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.string().min(1, 'Kategori seçilmelidir')
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
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
      isSaleActive: product.isSaleActive,
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
    // no-op for shared prisma
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const parseResult = productSchema.safeParse(await request.json());
    if (!parseResult.success) {
      const message = parseResult.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    const { name, slug, description, price, originalPrice, images, stock, isActive, isSaleActive, isFeatured, categoryId } = parseResult.data;

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
        isSaleActive: isSaleActive !== undefined ? isSaleActive : true,
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
    // no-op for shared prisma
  }
} 