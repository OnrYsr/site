import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Using shared prisma

// Tek ürün getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
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
      isSaleActive: product.isSaleActive,
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
    // no-op for shared prisma
  }
}

// Ürün güncelle (PATCH)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    
    // Sadece belirli alanların güncellenmesine izin ver
    const allowedFields = ['isActive', 'isSaleActive', 'isFeatured', 'name', 'description', 'price', 'originalPrice', 'stock', 'categoryId', 'images'];
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
    
    // Description için özel kontrol - boş string varsa null yap
    if (updateData.description !== undefined) {
      updateData.description = updateData.description.trim() || null;
    }

    const product = await prisma.product.update({
      where: { id },
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
      isSaleActive: product.isSaleActive,
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
    // no-op for shared prisma
  }
}

// Ürün sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    
    // Önce ürünün var olup olmadığını kontrol et
    const product = await prisma.product.findUnique({
      where: { id }
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
        where: { productId: id }
      }),
      prisma.orderItem.deleteMany({
        where: { productId: id }
      }),
      prisma.review.deleteMany({
        where: { productId: id }
      }),
      prisma.discount.deleteMany({
        where: { productId: id }
      }),
      // Son olarak ürünü sil
      prisma.product.delete({
        where: { id }
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
    // no-op for shared prisma
  }
} 