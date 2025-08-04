import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// İyzico API yapılandırması
const IYZICO_CONFIG = {
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  baseUrl: process.env.IYZICO_BASE_URL!
};

// Debug için konfigürasyonu logla
console.log('İyzico Config Debug:', {
  apiKey: IYZICO_CONFIG.apiKey ? 'SET' : 'NOT SET',
  secretKey: IYZICO_CONFIG.secretKey ? 'SET' : 'NOT SET', 
  baseUrl: IYZICO_CONFIG.baseUrl
});



export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { shippingInfo, paymentCard } = body;

    // Kullanıcının sepet verilerini al
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
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

    // Conversation ID - benzersiz işlem takip numarası
    const conversationId = `MSE_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // İyzico ödeme isteği hazırla (düzeltilmiş format)
    const paymentRequest = {
      locale: 'tr',
      conversationId: conversationId,
      price: 1.00, // Number olarak
      paidPrice: 1.00, // Number olarak
      currency: 'TRY',
      installment: 1, // Number olarak
      basketId: `B${Date.now()}`, // Benzersiz basket ID
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName: 'John Doe',
        cardNumber: '5528790000000008',
        expireMonth: '12',
        expireYear: '2030',
        cvc: '123',
        registerCard: '0'
      },
      buyer: {
        id: `BY${Date.now()}`, // Benzersiz buyer ID
        name: 'John',
        surname: 'Doe',
        gsmNumber: '+905350000000',
        email: 'email@email.com',
        identityNumber: '11111111111', // 11 haneli TC kimlik
        lastLoginDate: '2015-10-05 12:43:35',
        registrationDate: '2013-04-21 15:12:09',
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      billingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      basketItems: [
        {
          id: `BI${Date.now()}_1`,
          name: 'Binocular',
          category1: 'Collectibles',
          category2: 'Accessories',
          itemType: 'PHYSICAL',
          price: 0.3 // Number olarak
        },
        {
          id: `BI${Date.now()}_2`,
          name: 'Game code',
          category1: 'Game',
          category2: 'Online Game Items',
          itemType: 'VIRTUAL',
          price: 0.5 // Number olarak
        },
        {
          id: `BI${Date.now()}_3`,
          name: 'Usb',
          category1: 'Electronics',
          category2: 'Usb / Cable',
          itemType: 'PHYSICAL',
          price: 0.2 // Number olarak
        }
      ]
    };

    // --- IYZICO PAYMENT REQUEST LOG ---
    console.log('--- IYZICO PAYMENT REQUEST ---');
    Object.entries(paymentRequest).forEach(([key, value]) => {
      if (typeof value === 'object') {
        console.log(`${key}:`, JSON.stringify(value), '| type:', Array.isArray(value) ? 'array' : typeof value);
      } else {
        console.log(`${key}:`, value, '| type:', typeof value);
      }
    });
    console.log('Full JSON:', JSON.stringify(paymentRequest, null, 2));
    
    // İyzico Basic Authentication (test)
    const basicAuth = Buffer.from(`${IYZICO_CONFIG.apiKey}:${IYZICO_CONFIG.secretKey}`).toString('base64');
    
    // Debug için log
    console.log('İyzico Request Debug:', {
      basicAuth: `Basic ${basicAuth}`,
      requestBody: JSON.stringify(paymentRequest, null, 2)
    });
    
    // İyzico API'ye ödeme isteği gönder
    const iyzicopResponse = await fetch(`${IYZICO_CONFIG.baseUrl}/payment/auth`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: JSON.stringify(paymentRequest),
    });
    
    // Response'u güvenli şekilde parse et
    let paymentResult;
    const responseText = await iyzicopResponse.text();
    
    try {
      paymentResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response Text:', responseText);
      return NextResponse.json({
        success: false,
        error: 'İyzico API\'den geçersiz yanıt alındı',
        details: 'API HTML döndürdü, JSON bekleniyordu'
      }, { status: 500 });
    }
    // --- IYZICO PAYMENT RESPONSE LOG ---
    console.log('--- IYZICO PAYMENT RESPONSE ---');
    console.log('Status:', iyzicopResponse.status, iyzicopResponse.statusText);
    console.log('Headers:', Object.fromEntries(iyzicopResponse.headers.entries()));
    console.log('Body:', paymentResult);

    if (paymentResult.status === 'success') {
      // Ödeme başarılı - şimdi siparişi oluştur
      try {
        const order = await createOrderAfterPayment(
          paymentResult, 
          shippingInfo, 
          cartItems, 
          session.user.id, 
          conversationId
        );

        return NextResponse.json({
          success: true,
          data: {
            payment: paymentResult,
            order: order
          },
          message: 'Ödeme başarılı ve sipariş oluşturuldu'
        });
      } catch (orderError) {
        console.error('Order creation error after payment:', orderError);
        return NextResponse.json({
          success: false,
          error: 'Ödeme alındı fakat sipariş oluşturulamadı. Lütfen müşteri hizmetleri ile iletişime geçin.',
          paymentId: paymentResult.paymentId
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({
        success: false,
        error: paymentResult.errorMessage || 'Ödeme başarısız',
        errorCode: paymentResult.errorCode
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment process error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ödeme işlemi sırasında hata oluştu',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Ödeme sonrası sipariş oluşturma fonksiyonu
async function createOrderAfterPayment(
  paymentResult: any, 
  shippingInfo: any, 
  cartItems: any[], 
  userId: string,
  conversationId: string
) {
  // Sipariş numarası oluştur
  const orderNumber = `MSE${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Teslimat adresi oluştur
  const shippingAddress = await prisma.address.create({
    data: {
      userId: userId,
      type: 'SHIPPING',
      firstName: shippingInfo.firstName,
      lastName: shippingInfo.lastName,
      company: shippingInfo.company || null,
      address1: shippingInfo.address,
      address2: shippingInfo.address2 || null,
      city: shippingInfo.city,
      state: shippingInfo.state || shippingInfo.city,
      postalCode: shippingInfo.postalCode || '34000',
      country: shippingInfo.country || 'Turkey',
      phone: shippingInfo.phone || null,
    },
  });

  // Sipariş oluştur
  const order = await prisma.order.create({
    data: {
      userId: userId,
      orderNumber,
      totalAmount: Number(paymentResult.paidPrice),
      shippingAddressId: shippingAddress.id,
      billingAddressId: shippingAddress.id,
      paymentMethod: 'IYZICO_CREDIT_CARD',
      notes: shippingInfo.notes,
      status: 'CONFIRMED', // İyzico'dan ödeme onayı geldi
      paymentStatus: 'PAID', // Ödeme tamamlandı
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
      userId: userId,
    },
  });

  // Log kaydı tut
  await prisma.log.create({
    data: {
      type: 'PAYMENT_SUCCESS',
      userId: userId,
      message: `İyzico ödeme başarılı - Sipariş: ${orderNumber}`,
      meta: {
        conversationId,
        paymentId: paymentResult.paymentId,
        paidPrice: paymentResult.paidPrice,
        iyzico_result: paymentResult
      }
    }
  });

  return order;
} 