# İyzico Geliştirme Hata ve Çözüm Dokümantasyonu

## 📋 Genel Bilgiler
- **Proje**: Muse3DStudio E-Commerce Platform
- **Tarih**: 5 Ağustos 2025
- **Ortam**: Sandbox (Test)
- **API URL**: https://sandbox-api.iyzipay.com

## 🔑 Environment Variables
```env
IYZICO_API_KEY="sandbox-4LdmlHcLSVSNZ2ZFngDlR4bmzB5okEpV"
IYZICO_SECRET_KEY="sandbox-v3BcCMPRroO6TWm0zfKxNkaPvqCWSvMQ"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"
```

---

## ❌ HATA 1: "Geçersiz imza" (errorCode: "1000")

### 🕐 Tarih: 5 Ağustos 2025
### 📍 Hata Detayı:
```
{
  "status": "failure",
  "errorCode": "1000",
  "errorMessage": "Geçersiz imza",
  "locale": "tr",
  "systemTime": 1754382375479,
  "conversationId": "MSE_1754382375271_frv79s"
}
```

### 🔍 Hata Analizi:
- İyzico API'den `errorCode: "1000"` dönüyor
- Signature hesaplama algoritmasında problem var
- API bağlantısı başarılı (200 status) ama signature geçersiz

### 🛠️ Uygulanan Çözümler:

#### Çözüm 1: Manuel Signature Hesaplama
```typescript
function generateIyzicoSignature(apiKey: string, secretKey: string, randomString: string, requestBody: any) {
  const jsonBody = JSON.stringify(requestBody);
  const base64Body = Buffer.from(jsonBody, 'utf8').toString('base64');
  const signatureString = randomString + apiKey + base64Body;
  
  const hash = crypto
    .createHmac('sha1', secretKey)
    .update(signatureString)
    .digest('base64');

  return { hash, base64Body, jsonBody };
}
```

**Sonuç**: ❌ Başarısız - Aynı hata devam etti

#### Çözüm 2: İyzico SDK Entegrasyonu
```bash
npm install iyzipay
```

**Sonuç**: ❌ Başarısız - Next.js uyumluluk sorunu
```
Module not found: Can't resolve './ROOT/node_modules/iyzipay/lib/resources/'
```

#### Çözüm 3: Detaylı Loglama Sistemi
```typescript
function logPaymentStep(step: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔄 PAYMENT STEP: ${step}`);
  if (data) {
    console.log(`[${timestamp}] 📊 DATA:`, JSON.stringify(data, null, 2));
  }
}
```

**Sonuç**: ✅ Başarılı - Debug bilgileri eklendi

### 📊 Test Verileri:
- **Test Kartı**: 5528790000000008
- **Tutar**: 27.99 TL
- **API Status**: 200 (başarılı)
- **Signature Status**: Geçersiz

---

## 🔄 Devam Eden Sorunlar:

### 1. Signature Hesaplama Algoritması
**Durum**: ❌ Çözülmedi
**Öncelik**: YÜKSEK
**Açıklama**: İyzico'nun beklediği signature formatı farklı olabilir

### 2. İyzico SDK Uyumluluğu
**Durum**: ❌ Çözülmedi
**Öncelik**: ORTA
**Açıklama**: Next.js ile uyumluluk sorunu

---

## 🎯 Sonraki Adımlar:

### 1. İyzico Resmi Dokümantasyon Kontrolü
- [ ] İyzico'nun resmi signature hesaplama dokümantasyonunu kontrol et
- [ ] Farklı signature algoritmaları dene
- [ ] İyzico test ortamı ayarlarını kontrol et

### 2. Alternatif Çözümler
- [ ] İyzico SDK'sını farklı şekilde entegre et
- [ ] Başka bir ödeme sağlayıcısı dene
- [ ] İyzico destek ekibi ile iletişime geç

### 3. Debug ve Test
- [ ] Daha detaylı debug bilgileri ekle
- [ ] Farklı test kartları dene
- [ ] İyzico sandbox ayarlarını kontrol et

---

## 📝 Notlar:

### Önemli Bilgiler:
- İyzico sandbox ortamında çalışıyoruz
- API bağlantısı başarılı (200 status)
- Sorun sadece signature hesaplama algoritmasında
- Test kartları doğru çalışıyor

### Kullanılan Test Kartları:
- **Visa**: 5528790000000008
- **MasterCard**: 5890040000000016
- **Troy**: 9792030394440796

### Log Dosyası Konumu:
```
logs/payment.log
```

---

## 🔗 Faydalı Linkler:
- [İyzico API Dokümantasyonu](https://developer.iyzico.com/)
- [İyzico Test Kartları](https://developer.iyzico.com/en/sandbox)
- [İyzico Node.js SDK](https://github.com/iyzico/iyzipay-node)

---

## 📞 İletişim:
- **İyzico Destek**: https://iyzico.com/contact
- **API Dokümantasyonu**: https://developer.iyzico.com/

---

*Bu dokümantasyon İyzico entegrasyonu sırasında karşılaşılan hataları ve çözümleri takip etmek için oluşturulmuştur.* 