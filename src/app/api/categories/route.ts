import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Kategori adı gereklidir').trim(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  displayOrder: z.number().int().min(0, 'Gösterim sırası 0-999 arasında sayısal bir değer olmalıdır').max(999),
  isActive: z.boolean().optional().default(true),
  showOnHomepage: z.boolean().optional().default(false)
});

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const homepage = searchParams.get('homepage');
    
    // Base where condition
    const whereCondition: any = {};
    
    // If homepage=true parameter is passed, only show categories with showOnHomepage=true
    if (homepage === 'true') {
      whereCondition.showOnHomepage = true;
    }
    
    const categories = await prisma.category.findMany({
      where: whereCondition,
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
          },
          orderBy: [
            {
              displayOrder: 'asc'
            },
            {
              name: 'asc'
            }
          ]
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
      orderBy: [
        {
          displayOrder: 'asc'
        },
        {
          name: 'asc'
        }
      ]
    });

    const formattedCategories = categories.map((category: any) => {
      // Ana kategoriler için product count hesapla: doğrudan bağlı + alt kategorilerdeki
      const subcategoriesProductCount = category.subcategories.reduce((total: number, sub: any) => {
        return total + sub._count.products;
      }, 0);
      
      const totalProductCount = category._count.products + subcategoriesProductCount;

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        parentId: category.parentId,
        displayOrder: category.displayOrder,
        isActive: category.isActive,
        productCount: totalProductCount,
        subcategories: category.subcategories.map((sub: any) => ({
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
    });

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
    // no-op for shared prisma
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const parseResult = categorySchema.safeParse(await request.json());
    if (!parseResult.success) {
      const message = parseResult.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    const { name, description, image, parentId, displayOrder, isActive, showOnHomepage } = parseResult.data;



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
        displayOrder: displayOrder,
        isActive: isActive !== undefined ? isActive : true,
        showOnHomepage: showOnHomepage !== undefined ? showOnHomepage : false
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
    // no-op for shared prisma
  }
} 