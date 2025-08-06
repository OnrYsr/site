import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Admin için tüm siparişleri listele
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      totalAmount: Number(order.totalAmount),
      status: order.status,
      paymentStatus: order.paymentStatus,
      user: {
        firstName: order.user.firstName || '',
        lastName: order.user.lastName || '',
        email: order.user.email,
      },
      items: order.items,
    }));

    return NextResponse.json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Siparişler getirilirken hata oluştu' },
      { status: 500 }
    );
  }
} 