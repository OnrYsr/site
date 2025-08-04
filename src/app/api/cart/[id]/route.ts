import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/cart/[id] - Sepet item quantity güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quantity } = await request.json();
    const { id: cartItemId } = await params;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    // Sepet item'ının kullanıcıya ait olduğunu kontrol et
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id
      }
    });

    if (!existingCartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Quantity'yi güncelle
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId
      },
      data: {
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

    return NextResponse.json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedCartItem
    });

  } catch (error) {
    console.error('Cart PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[id] - Sepet item sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: cartItemId } = await params;

    // Sepet item'ının kullanıcıya ait olduğunu kontrol et
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id
      }
    });

    if (!existingCartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Sepet item'ını sil
    await prisma.cartItem.delete({
      where: {
        id: cartItemId
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Cart item removed successfully'
    });

  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 