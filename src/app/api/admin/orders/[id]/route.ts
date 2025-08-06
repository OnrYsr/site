import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH: Sipariş durumunu güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    // Geçerli durumları kontrol et
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz sipariş durumu' },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          select: {
            quantity: true,
          },
        },
      },
    });

    const formattedOrder = {
      id: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      createdAt: updatedOrder.createdAt.toISOString(),
      totalAmount: Number(updatedOrder.totalAmount),
      status: updatedOrder.status,
      paymentStatus: updatedOrder.paymentStatus,
      user: {
        firstName: updatedOrder.user.firstName || '',
        lastName: updatedOrder.user.lastName || '',
        email: updatedOrder.user.email,
      },
      items: updatedOrder.items,
    };

    return NextResponse.json({
      success: true,
      message: 'Sipariş durumu başarıyla güncellendi',
      data: formattedOrder,
    });
  } catch (error) {
    console.error('Order status update error:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş durumu güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
} 