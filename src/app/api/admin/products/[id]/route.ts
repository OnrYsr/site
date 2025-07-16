import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tek ürün getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
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
      categoryId: product.categoryId,
      category: product.category,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: formattedProduct
    });

  } catch (error) {
    console.error('Admin Product GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Ürün yüklenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Ürün güncelle (PATCH)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Sadece belirli alanların güncellenmesine izin ver
    const allowedFields = ['isActive', 'isFeatured', 'name', 'description', 'price', 'originalPrice', 'stock', 'categoryId', 'images'];
    const updateData: any = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Fiyat alanları için tip dönüşümü
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.originalPrice !== undefined) {
      updateData.originalPrice = updateData.originalPrice ? Number(updateData.originalPrice) : null;
    }
    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
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
      message: 'Ürün başarıyla güncellendi',
      data: formattedProduct
    });

  } catch (error) {
    console.error('Admin Product PATCH Error:', error);
    return NextResponse.json(
      { success: false, error: 'Ürün güncellenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Ürün sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Önce ürünün var olup olmadığını kontrol et
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    // İlişkili verileri de sil (cascade silme)
    await prisma.$transaction([
      // Önce ürünle ilişkili verileri sil
      prisma.cartItem.deleteMany({
        where: { productId: params.id }
      }),
      prisma.orderItem.deleteMany({
        where: { productId: params.id }
      }),
      prisma.review.deleteMany({
        where: { productId: params.id }
      }),
      prisma.discount.deleteMany({
        where: { productId: params.id }
      }),
      // Son olarak ürünü sil
      prisma.product.delete({
        where: { id: params.id }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: 'Ürün başarıyla silindi'
    });

  } catch (error) {
    console.error('Admin Product DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Ürün silinirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 