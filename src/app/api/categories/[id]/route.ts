import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u') 
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// GET single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        subcategories: {
          where: {
            isActive: true
          },
          include: {
            _count: {
              select: {
                products: {
                  where: {
                    isActive: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            products: {
              where: {
                isActive: true
              }
            }
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    const formattedCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: category.parentId,
      parent: category.parent,
      displayOrder: category.displayOrder,
      isActive: category.isActive,
      productCount: category._count.products,
      subcategories: category.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        image: sub.image,
        parentId: sub.parentId,
        isActive: sub.isActive,
        productCount: sub._count.products,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt
      })),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: formattedCategory
    });

  } catch (error) {
    console.error('Get category error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategori yüklenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, image, parentId, displayOrder, isActive } = await request.json();

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Kategori adı gereklidir' },
        { status: 400 }
      );
    }

    // Validate displayOrder
    const orderValue = Number(displayOrder);
    if (isNaN(orderValue) || orderValue < 0 || orderValue > 999) {
      return NextResponse.json(
        { success: false, error: 'Gösterim sırası 0-999 arasında sayısal bir değer olmalıdır' },
        { status: 400 }
      );
    }

    // Validate parent category if provided
    if (parentId && parentId !== id) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId }
      });
      if (!parentCategory) {
        return NextResponse.json(
          { success: false, error: 'Üst kategori bulunamadı' },
          { status: 400 }
        );
      }
      
      // Prevent circular reference (category can't be its own parent)
      if (parentId === id) {
        return NextResponse.json(
          { success: false, error: 'Kategori kendisinin alt kategorisi olamaz' },
          { status: 400 }
        );
      }
    }

    // Generate new slug if name changed
    let slug = existingCategory.slug;
    if (name.trim() !== existingCategory.name) {
      const baseSlug = generateSlug(name);
      slug = baseSlug;
      let counter = 1;

      // Check if slug exists (but not the current category)
      while (true) {
        const existingSlug = await prisma.category.findUnique({ 
          where: { slug } 
        });
        if (!existingSlug || existingSlug.id === id) {
          break;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        image: image?.trim() || null,
        parentId: parentId || null,
                  displayOrder: orderValue,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        subcategories: {
          where: {
            isActive: true
          },
          include: {
            _count: {
              select: {
                products: {
                  where: {
                    isActive: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            products: {
              where: {
                isActive: true
              }
            }
          }
        }
      }
    });

    const formattedCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: category.parentId,
      parent: category.parent,
      displayOrder: category.displayOrder,
      isActive: category.isActive,
      productCount: category._count.products,
      subcategories: category.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        image: sub.image,
        parentId: sub.parentId,
        displayOrder: sub.displayOrder,
        isActive: sub.isActive,
        productCount: sub._count.products,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt
      })),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Kategori başarıyla güncellendi',
      data: formattedCategory
    });

  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategori güncellenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Bu kategoriye ait ürünler bulunmaktadır. Önce ürünleri başka kategoriye taşıyın veya silin.' 
        },
        { status: 400 }
      );
    }

    // Check if category has subcategories
    if (existingCategory.subcategories.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Bu kategorinin alt kategorileri bulunmaktadır. Önce alt kategorileri silin veya başka kategoriye taşıyın.' 
        },
        { status: 400 }
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Kategori başarıyla silindi'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategori silinirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 