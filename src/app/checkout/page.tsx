'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CreditCard, User, Mail, MapPin, ArrowLeft, CheckCircle, ShoppingCart, Loader2, Lock, Building } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  company?: string;
  notes?: string;
}

interface PaymentCard {
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, totalAmount, totalItems, isLoading: cartLoading, clearCart, fetchCart } = useCart();
  
  const [activeTab, setActiveTab] = useState<'shipping' | 'payment'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentError, setPaymentError] = useState('');
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    company: '',
    notes: '',
  });

  const [paymentCard, setPaymentCard] = useState<PaymentCard>({
    cardHolderName: '',
    cardNumber: '',
    expireMonth: '',
    expireYear: '',
    cvc: '',
  });

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
  });

  // Auth kontrolü
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  // Email'i session'dan al
  useEffect(() => {
    if (session?.user?.email) {
      setShippingInfo(prev => ({
        ...prev,
        email: session.user.email || '',
      }));
    }
  }, [session]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Kart numarası formatlaması
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    }
    
    // CVC formatlaması
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    // Ay formatlaması
    if (name === 'expireMonth') {
      formattedValue = value.replace(/\D/g, '').substring(0, 2);
      if (parseInt(formattedValue) > 12) formattedValue = '12';
    }

    // Yıl formatlaması
    if (name === 'expireYear') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setPaymentCard(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validateShippingInfo = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    return requiredFields.every(field => shippingInfo[field as keyof ShippingInfo]?.trim());
  };

  const validatePaymentCard = () => {
    const { cardHolderName, cardNumber, expireMonth, expireYear, cvc } = paymentCard;
    
    if (!cardHolderName.trim()) return 'Kart sahibi adı gerekli';
    if (!cardNumber.replace(/\s/g, '') || cardNumber.replace(/\s/g, '').length < 16) return 'Geçerli kart numarası girin';
    if (!expireMonth || parseInt(expireMonth) < 1 || parseInt(expireMonth) > 12) return 'Geçerli ay girin';
    if (!expireYear || expireYear.length !== 4) return 'Geçerli yıl girin (YYYY)';
    if (!cvc || cvc.length < 3) return 'Geçerli CVC girin';
    
    return null;
  };

  const validateAgreements = () => {
    if (!agreements.terms) return 'Kullanım şartlarını kabul etmelisiniz';
    if (!agreements.privacy) return 'Gizlilik politikasını kabul etmelisiniz';
    return null;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      setPaymentError('Sepetiniz boş!');
      return;
    }

    if (!validateShippingInfo()) {
      setPaymentError('Lütfen tüm gerekli adres bilgilerini doldurun');
      return;
    }

    const cardValidationError = validatePaymentCard();
    if (cardValidationError) {
      setPaymentError(cardValidationError);
      return;
    }

    const agreementValidationError = validateAgreements();
    if (agreementValidationError) {
      setPaymentError(agreementValidationError);
      return;
    }

    setIsSubmitting(true);
    setPaymentError('');
    
    try {
      // İyzico ödeme API'sine gönder
      const response = await fetch('/api/payment/iyzico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingInfo,
          paymentCard: {
            cardHolderName: paymentCard.cardHolderName,
            cardNumber: paymentCard.cardNumber.replace(/\s/g, ''),
            expireMonth: paymentCard.expireMonth.padStart(2, '0'),
            expireYear: paymentCard.expireYear,
            cvc: paymentCard.cvc,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderNumber(data.data.order.orderNumber);
        setOrderCreated(true);
        // Sepeti temizle
        await clearCart();
        await fetchCart();
      } else {
        setPaymentError(data.error || 'Ödeme işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      setPaymentError('Ödeme işlemi sırasında hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading states
  if (status === 'loading' || cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Sepet boş
  if (items.length === 0 && !orderCreated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-6">Ödeme yapabilmek için sepetinizde ürün bulunmalıdır.</p>
          <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    );
  }

  // Sipariş başarılı
  if (orderCreated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🎉 Ödeme Başarılı!</h1>
          <p className="text-gray-600 mb-4">Sipariş numaranız: <strong className="text-blue-600">{orderNumber}</strong></p>
          <p className="text-gray-600 mb-6">Siparişiniz başarıyla tamamlandı ve ödemeniz alındı. Sipariş detayları e-posta adresinize gönderildi.</p>
          <div className="space-y-3">
            <Link href="/profile/orders" className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Siparişlerimi Görüntüle
            </Link>
            <Link href="/" className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Anasayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sol taraf - Ödeme formu */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Ödeme Bilgileri</h1>
            
            {/* Tab Navigation */}
            <div className="flex mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('shipping')}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Building className="w-4 h-4 inline mr-2" />
                Adres Bilgileri
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'payment'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Kart Bilgileri
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Adres Bilgileri Tab */}
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        Ad *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Adınız"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Soyad *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Soyadınız"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="E-posta adresiniz"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Telefon numaranız"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Adres *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tam adresiniz"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        Şehir *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Şehir"
                      />
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Posta Kodu
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Posta kodu"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={shippingInfo.company}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Şirket adı"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Sipariş Notları (Opsiyonel)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={shippingInfo.notes}
                      onChange={handleShippingChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Özel talepleriniz..."
                    />
                  </div>
                </div>
              )}
              
              {/* Kart Bilgileri Tab */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800">Güvenli Ödeme</h3>
                      <p className="text-blue-700">İyzico güvenli ödeme sistemi ile korunuyor</p>
                    </div>
                  </div>

                  {/* Ödeme Hatası */}
                  {paymentError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Ödeme Hatası</h3>
                          <p className="text-sm text-red-700 mt-1">{paymentError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Kart Sahibi */}
                  <div>
                    <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 mb-2">
                      Kart Sahibi Adı *
                    </label>
                    <input
                      type="text"
                      id="cardHolderName"
                      name="cardHolderName"
                      value={paymentCard.cardHolderName}
                      onChange={handlePaymentChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Kart üzerindeki isim"
                    />
                  </div>
                  
                  {/* Kart Numarası */}
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Kart Numarası *
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentCard.cardNumber}
                        onChange={handlePaymentChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                  </div>
                  
                  {/* Son Kullanma ve CVC */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="expireMonth" className="block text-sm font-medium text-gray-700 mb-2">
                        Ay *
                      </label>
                      <input
                        type="text"
                        id="expireMonth"
                        name="expireMonth"
                        value={paymentCard.expireMonth}
                        onChange={handlePaymentChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <label htmlFor="expireYear" className="block text-sm font-medium text-gray-700 mb-2">
                        Yıl *
                      </label>
                      <input
                        type="text"
                        id="expireYear"
                        name="expireYear"
                        value={paymentCard.expireYear}
                        onChange={handlePaymentChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2025"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-2">
                        CVC *
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        name="cvc"
                        value={paymentCard.cvc}
                        onChange={handlePaymentChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  {/* Sözleşme Onayları */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Sözleşme Onayları</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreements.terms}
                          onChange={(e) => setAgreements(prev => ({ ...prev, terms: e.target.checked }))}
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Kullanım Şartları</span>
                          <span className="text-gray-500"> - </span>
                          <span className="text-gray-500">
                            Muse3D Studio'nun kullanım şartlarını okudum ve kabul ediyorum. 
                            <a href="/terms" target="_blank" className="text-blue-600 hover:underline ml-1">
                              Detayları görüntüle
                            </a>
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreements.privacy}
                          onChange={(e) => setAgreements(prev => ({ ...prev, privacy: e.target.checked }))}
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Gizlilik Politikası</span>
                          <span className="text-gray-500"> - </span>
                          <span className="text-gray-500">
                            Kişisel verilerimin işlenmesine ilişkin gizlilik politikasını okudum ve kabul ediyorum.
                            <a href="/privacy" target="_blank" className="text-blue-600 hover:underline ml-1">
                              Detayları görüntüle
                            </a>
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Ödeme İşleniyor...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    ₺{(totalAmount * 1.18).toFixed(2)} Öde
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sağ taraf - Sipariş özeti */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-gray-500 text-sm">{item.product.category.name}</p>
                    <p className="text-gray-600">Adet: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-gray-900">
                    ₺{(Number(item.product.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-900">Ara Toplam ({totalItems} ürün)</span>
                <span className="text-gray-900">₺{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900">KDV (%18)</span>
                <span className="text-gray-900">₺{(totalAmount * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900">Kargo</span>
                <span className="text-green-600">Ücretsiz</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span className="text-gray-900">Toplam</span>
                <span className="text-gray-900">₺{(totalAmount * 1.18).toFixed(2)}</span>
              </div>
            </div>

            {/* İyzico Logo */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>İyzico ile güvenli ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 