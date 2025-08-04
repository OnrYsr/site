import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/cart - Kullanıcının sepet ürünlerini getir
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const cartWithTotal = {
      items: cartItems,
      totalAmount: cartItems.reduce((total, item) => {
        return total + (Number(item.product.price) * item.quantity);
      }, 0),
      totalItems: cartItems.reduce((total, item) => total + item.quantity, 0)
    };

    return NextResponse.json({
      success: true,
      data: cartWithTotal
    });

  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Sepete ürün ekle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Ürünün mevcut olup olmadığını ve satışa açık olup olmadığını kontrol et
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.isActive || !product.isSaleActive) {
      return NextResponse.json(
        { success: false, error: 'Product is not available for sale' },
        { status: 400 }
      );
    }

    // Mevcut sepet item'ını kontrol et
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId
        }
      }
    });

    let cartItem;

    if (existingCartItem) {
      // Mevcut item varsa quantity'yi artır
      cartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id
        },
        data: {
          quantity: existingCartItem.quantity + quantity
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      });
    } else {
      // Yeni item ekle
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId: productId,
          quantity: quantity
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: existingCartItem ? 'Product quantity updated in cart' : 'Product added to cart',
      data: cartItem
    });

  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 