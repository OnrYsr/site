# HappyBee - 3D Ürünler E-Ticaret Sitesi

Bu proje, 3D ürünler satışı için modern, modüler ve özelleştirilebilir bir e-ticaret platformudur. Next.js, TypeScript, Tailwind CSS ve Prisma ile geliştirilmiştir.

## 🚀 Mevcut Özellikler

### ✅ **Çalışan Sistemler**
- **🔐 Kullanıcı Giriş/Kayıt**: NextAuth ile tam fonksiyonel
- **📦 Ürün Sistemi**: API'dan dinamik veri çekme
- **🏷️ Kategori Sistemi**: Filtreleme ve listeleme
- **🔍 Arama ve Filtreleme**: Fiyat aralığı, kategori, sıralama
- **📱 Responsive Tasarım**: Mobil uyumlu
- **⚡ Gerçek Zamanlı Veri**: PostgreSQL veritabanı bağlantısı

### 🎨 **Tasarım Özellikleri**
- Modern ve responsive tasarım
- Özelleştirilebilir renk paleti (Tailwind CSS)
- Dinamik kategori kartları
- Loading ve error state'leri
- Smooth animasyonlar (Framer Motion)

### 🗄️ **Veritabanı ve API**
- **PostgreSQL** veritabanı
- **Prisma ORM** ile type-safe veritabanı işlemleri
- RESTful API endpoints:
  - `GET /api/products` - Ürün listeleme + filtreleme
  - `GET /api/products/[slug]` - Ürün detayı
  - `GET /api/categories` - Kategori listeleme
  - `POST /api/auth/...` - Kullanıcı yönetimi

## 📦 Kurulum

### 1️⃣ **Projeyi Klonlayın**
```bash
git clone <repo-url>
cd site
```

### 2️⃣ **Bağımlılıkları Yükleyin**
```bash
npm install
```

### 3️⃣ **Çevre Değişkenlerini Ayarlayın**
`.env` dosyasını oluşturun:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/happybee"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-key-here-1234567890"
```

### 4️⃣ **Veritabanını Hazırlayın**
```bash
# PostgreSQL'i başlatın
brew services start postgresql@14

# Veritabanı şemasını oluşturun
npx prisma db push

# Test verilerini ekleyin
npx ts-node prisma/seed-user.ts
npx ts-node prisma/seed-products.ts
```

### 5️⃣ **Geliştirme Sunucusunu Başlatın**
```bash
npm run dev
```

🌐 **Site**: http://localhost:3000  
🗄️ **Prisma Studio**: http://localhost:5555 (opsiyonel)

## 🔧 Test Kullanıcısı
- **Email**: `onuryasar@tes.com`
- **Şifre**: `123`

## 📊 Mevcut Veriler
- **6 Kategori**: Mimari, Karakter, Araç, Mobilya, Elektronik, Doğa
- **12 Ürün**: Her kategoride 2'şer ürün
- **Test Kullanıcı**: Giriş için hazır

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # NextAuth
│   │   ├── products/      # Ürün API'ları
│   │   └── categories/    # Kategori API'ları
│   ├── products/          # Ürün sayfaları
│   ├── auth/              # Giriş/kayıt
│   └── admin/             # Admin panel (geliştirme aşamasında)
├── components/            # React bileşenleri
│   ├── home/              # Ana sayfa bileşenleri
│   ├── layout/            # Header, Footer
│   ├── products/          # Ürün bileşenleri
│   └── providers/         # Context providers
├── prisma/                # Veritabanı şeması ve seed'ler
└── types/                 # TypeScript tip tanımları
```

## 🛠️ Teknolojiler

### **Frontend**
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasyonlar
- **Lucide React** - İkonlar

### **Backend**
- **NextAuth.js** - Authentication
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **bcryptjs** - Password hashing

### **Development**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 🚀 Deploy

### **Veritabanı (Production)**
1. PostgreSQL instance oluşturun (AWS RDS, Supabase, vb.)
2. `DATABASE_URL`'yi production DB'ye güncelleyin
3. `npx prisma db push` ile şemayı deploy edin

### **Uygulama Deploy**
```bash
# Vercel
vercel deploy

# Çevre değişkenlerini ayarlayın:
# DATABASE_URL=<production-db-url>
# NEXTAUTH_URL=<your-domain>
# NEXTAUTH_SECRET=<random-secret>
```

## 🔄 Geliştirme Durumu

### ✅ **Tamamlanan**
- [x] Kullanıcı authentication
- [x] Ürün listeleme ve filtreleme
- [x] Kategori sistemi
- [x] Responsive tasarım
- [x] API endpoints
- [x] Veritabanı entegrasyonu

### 🔄 **Geliştirme Aşamasında**
- [ ] Sepet sistemi
- [ ] Ödeme entegrasyonu
- [ ] Admin panel (CRUD işlemleri)
- [ ] Gerçek ürün görselleri
- [ ] Email sistemi

### 💡 **Gelecek Özellikler**
- [ ] Ürün yorumları ve puanlama
- [ ] Favori ürünler
- [ ] Görsel upload sistemi
- [ ] Çoklu dil desteği

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

## 📞 İletişim

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.

**Proje Durumu**: �� Aktif Geliştirme
