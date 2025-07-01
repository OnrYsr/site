# 3D Ürünler E-Ticaret Sitesi

Bu proje, 3D ürünler satışı için modern, modüler ve özelleştirilebilir bir e-ticaret platformudur. Next.js, TypeScript, Tailwind CSS ve Prisma ile geliştirilmiştir.

## 🚀 Özellikler
- Modern ve responsive tasarım
- Kategori ve ürün listeleme
- Ürün detay sayfası
- Sepet ve ödeme akışı
- Kullanıcı kayıt/giriş sistemi
- Profil, siparişlerim, faturalarım ve hesap ayarları
- Hakkımızda ve iletişim sayfaları
- Modüler yapı: Admin panel ile içerik yönetimi (geliştirilebilir)
- Kolayca özelleştirilebilir tema ve içerik

## 📦 Kurulum

1. **Projeyi klonlayın:**
   ```bash
   git clone <repo-url>
   cd <proje-klasörü>
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Veritabanı ayarları:**
   - `.env` dosyasında `DATABASE_URL` değerini kendi PostgreSQL bağlantı adresinizle güncelleyin.
   - Prisma şemasını veritabanına yansıtın:
     ```bash
     npx prisma db push
     ```

4. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```
   Ardından [http://localhost:3000](http://localhost:3000) adresini ziyaret edin.

## 🛠️ Geliştirme
- Tüm sayfalar `src/app` altında bulunur.
- Bileşenler `src/components` altında modüler olarak ayrılmıştır.
- Mock verilerle çalışır, backend ve admin panel entegrasyonu için hazırdır.
- Tasarımda Tailwind CSS ve Lucide React ikonları kullanılmıştır.

## 🏗️ Deploy
- Vercel, Netlify veya kendi sunucunuzda kolayca deploy edebilirsiniz.
- Çevre değişkenlerini (örn. veritabanı bağlantısı) production ortamında ayarlamayı unutmayın.

## 👩‍💻 Katkı
- Pull request ve issue açarak katkıda bulunabilirsiniz.
- Kod standartlarına ve proje yapısına uygun PR göndermeye özen gösterin.

## 📄 Lisans
MIT

---

**Not:**
- Admin panel, ürün ekleme/düzenleme, sipariş yönetimi ve ödeme entegrasyonu için backend geliştirmesi gereklidir.
- Demo görselleri ve içerikler örnek olarak eklenmiştir.

Her türlü soru ve öneriniz için iletişime geçebilirsiniz!
