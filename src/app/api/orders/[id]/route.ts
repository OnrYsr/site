import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: Belirli bir siparişin detaylarını getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = await prisma.order.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    // Sipariş verilerini düzenle
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      totalAmount: Number(order.totalAmount),
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        image: item.product.images[0] || null,
      })),
      shippingAddress: {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        address: order.shippingAddress.address1,
        city: order.shippingAddress.city,
        postalCode: order.shippingAddress.postalCode,
        phone: order.shippingAddress.phone,
      },
      billingAddress: {
        firstName: order.billingAddress.firstName,
        lastName: order.billingAddress.lastName,
        address: order.billingAddress.address1,
        city: order.billingAddress.city,
        postalCode: order.billingAddress.postalCode,
      },
    };

    return NextResponse.json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    console.error('Sipariş getirilirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş getirilirken hata oluştu' },
      { status: 500 }
    );
  }
} 