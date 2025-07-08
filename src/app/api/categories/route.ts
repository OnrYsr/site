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

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
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
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: category.parentId,
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
    }));

    return NextResponse.json({
      success: true,
      data: formattedCategories,
      count: formattedCategories.length
    });

  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategoriler yüklenirken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, image, parentId, isActive } = await request.json();

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Kategori adı gereklidir' },
        { status: 400 }
      );
    }

    // Validate parent category if provided
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId }
      });
      if (!parentCategory) {
        return NextResponse.json(
          { success: false, error: 'Üst kategori bulunamadı' },
          { status: 400 }
        );
      }
    }

    // Generate slug
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists and generate unique one
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        image: image?.trim() || null,
        parentId: parentId || null,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
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
            products: true
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
      message: 'Kategori başarıyla oluşturuldu',
      data: formattedCategory
    }, { status: 201 });

  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategori oluşturulurken hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 