import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: Kullanıcının siparişlerini listele
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          select: {
            id: true,
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
      items: order.items,
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error('Siparişler getirilirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Siparişler getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Yeni sipariş oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      shippingInfo, 
      paymentMethod = 'CREDIT_CARD',
      notes 
    } = body;

    // Kullanıcının sepet verilerini al
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Sepetiniz boş' },
        { status: 400 }
      );
    }

    // Toplam tutar hesapla
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);

    // Sipariş numarası oluştur
    const orderNumber = `MSE${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Teslimat adresi oluştur
    const shippingAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        type: 'SHIPPING',
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        company: shippingInfo.company || null,
        address1: shippingInfo.address,
        address2: shippingInfo.address2 || null,
        city: shippingInfo.city,
        state: shippingInfo.state || shippingInfo.city,
        postalCode: shippingInfo.postalCode || '00000',
        country: shippingInfo.country || 'Turkey',
        phone: shippingInfo.phone || null,
      },
    });

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber,
        totalAmount,
        shippingAddressId: shippingAddress.id,
        billingAddressId: shippingAddress.id, // Şimdilik aynı adres
        paymentMethod,
        notes,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    // Sepeti boşalt
    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Siparişiniz başarıyla oluşturuldu',
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
} 