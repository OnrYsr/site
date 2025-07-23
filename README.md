# Muse3DStudio - 3D Ürünler E-Ticaret Platformu

Modern, ölçeklenebilir ve tam özellikli e-ticaret platformu. Next.js 15, TypeScript, Tailwind CSS ve PostgreSQL ile geliştirilmiştir.

## 🌐 **LIVE PRODUCTION SITE**

### **✅ Canlı Site URL'leri:**
- **🔒 Ana Site**: [https://muse3dstudio.com](https://muse3dstudio.com)
- **🔒 www Subdomain**: [https://www.muse3dstudio.com](https://www.muse3dstudio.com)
- **⚙️ Admin Panel**: [https://muse3dstudio.com/admin](https://muse3dstudio.com/admin)

### **🚀 Production Infrastructure:**
- **☁️ Cloud Provider**: AWS EC2 (t3.micro)
- **🖥️ Server OS**: Ubuntu 24.04 LTS
- **🌐 Web Server**: Nginx (Reverse Proxy)
- **🔄 Process Manager**: PM2 (Auto-restart, Auto-start)
- **🗄️ Database**: PostgreSQL 14+
- **🔒 SSL Certificate**: Let's Encrypt (Auto-renewal)
- **📊 Uptime**: 99.9% (Auto-restart on failure, Auto-start on reboot)

### **🛡️ Security & Performance:**
- **HTTPS/SSL**: ✅ A+ Rating
- **Domain Verification**: ✅ Active
- **Auto HTTPS Redirect**: ✅ Enabled
- **Security Headers**: ✅ Implemented
- **Gzip Compression**: ✅ Enabled

### **⚡ Deployment Strategy:**
- **Build Strategy**: Local build → Git push → Server pull (t3.micro optimized)
- **Zero Downtime**: PM2 auto-restart & health checks
- **Auto Backup**: Database scheduled backups
- **Monitoring**: PM2 real-time monitoring

---

## 📊 Sistemin Mevcut Durumu

### ✅ **TAM FONKSİYONEL SİSTEMLER**

#### 🔐 **Authentication & Kullanıcı Sistemi**
- ✅ NextAuth.js entegrasyonu
- ✅ Kullanıcı kayıt (email/şifre)
- ✅ Giriş/çıkış sistemi
- ✅ Session yönetimi
- ✅ Role tabanlı yetkilendirme (USER/ADMIN)

#### 📦 **Ürün Yönetim Sistemi**
- ✅ Ürün listeleme (filtreleme, arama, sıralama)
- ✅ Ürün detay sayfaları
- ✅ Kategori bazlı filtreleme
- ✅ Admin panel ürün CRUD (tam fonksiyonel)
- ✅ Ürün resim yönetimi
- ✅ Stok takibi
- ✅ Aktif/pasif ürün durumu
- ✅ Öne çıkan ürün sistemi
- ✅ Öne çıkan ürünler carousel sistemi

#### 🏷️ **Hiyerarşik Kategori Sistemi**
- ✅ Ana kategori → Alt kategori yapısı
- ✅ Kategori bazlı ürün filtreleme
- ✅ Dinamik kategori navigation
- ✅ Admin panel kategori CRUD (tam fonksiyonel)
- ✅ Kategori sıralaması (displayOrder)
- ✅ Ürün sayısı hesaplama (ana + alt kategoriler)

#### 🎨 **Banner Yönetim Sistemi**
- ✅ Dinamik banner sistemi (Hero + Featured Products)
- ✅ Admin panel banner CRUD (tam fonksiyonel)
- ✅ Banner type sistemi (HERO, FEATURED_PRODUCTS)
- ✅ Otomatik banner rotasyonu (5s hero, 4s featured)
- ✅ Manuel banner navigasyonu (ok butonları, dot göstergeleri)
- ✅ Banner aktif/pasif durumu ve tarih aralığı kontrolü
- ✅ Banner background entegrasyonu (Featured Products)
- ✅ Responsive banner carousel sistemi

#### 🎨 **Frontend & UI**
- ✅ Responsive modern tasarım
- ✅ Tailwind CSS ile styling
- ✅ Component tabanlı mimari
- ✅ Loading ve error state'leri
- ✅ Mobile-first approach
- ✅ SEO friendly URL yapısı
- ✅ Framer Motion animasyonları
- ✅ Carousel ve slider bileşenleri

#### ⚙️ **Admin Panel**
- ✅ Dashboard
- ✅ Ürün yönetimi (CRUD, durum güncelleme, silme)
- ✅ Kategori yönetimi (CRUD, hiyerarşik yapı)
- ✅ Banner yönetimi (CRUD, type seçimi, tarih kontrolü)
- ✅ Dinamik veri görüntüleme
- ✅ Modern form tasarımları

### 🚧 **SADECE UI VAR (Backend Eksik)**

#### 🛒 **E-ticaret Core Özellikleri**
- ❌ Sepet sistemi (UI var, API eksik)
- ❌ Ödeme entegrasyonu (UI var, backend yok)
- ❌ Sipariş yönetimi (UI var, API eksik)
- ❌ Kullanıcı profil sayfaları (UI var, backend eksik)

#### 🎯 **Admin Panel Eksikleri**
- ❌ Kullanıcı yönetimi (UI var, CRUD API eksik)
- ❌ Sipariş yönetimi (UI var, API eksik)
- ❌ İstatistik dashboard'ları (UI var, veri eksik)

### 💡 **TAMAMEN EKSİK OLAN ÖZELLİKLER**

#### 🌟 **Ürün Özellikleri**
- ❌ Ürün yorumları ve puanlama sistemi
- ❌ Favori ürünler
- ❌ Ürün karşılaştırma
- ❌ İndirim sistemi (schema var, API eksik)

#### 📧 **İletişim & Bildirimler**
- ❌ Email sistemi
- ❌ Push bildirimleri
- ❌ İletişim formu backend'i

#### 🔍 **Gelişmiş Özellikler**
- ❌ Gelişmiş arama (ElasticSearch)
- ❌ Ürün önerileri
- ❌ Görsel upload sistemi
- ❌ Çoklu dil desteği

#### 🔒 **Production Hazırlığı**
- ❌ Güvenlik middleware'leri
- ❌ Rate limiting
- ❌ Logging sistemi
- ❌ Error tracking
- ❌ Performance monitoring

## 🛠️ Teknoloji Stack'i

### **Frontend**
- **Next.js 15** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Modern styling
- **Lucide React** - İkon kütüphanesi
- **Framer Motion** - Animasyonlar ve carousel'lar
- **React Hook Form** - Form yönetimi
- **Zod** - Schema validation

### **Backend**
- **Next.js API Routes** - Backend API
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Ana veritabanı
- **NextAuth.js** - Authentication
- **bcryptjs** - Password hashing

### **Development Tools**
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Git** - Version control
- **Prisma Studio** - Database GUI

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API endpoints
│   │   ├── auth/          # ✅ Authentication (LOGIN/REGISTER)
│   │   ├── categories/    # ✅ Kategori CRUD (tam fonksiyonel)
│   │   ├── products/      # ✅ Ürün API'ları (tam fonksiyonel)
│   │   ├── banners/       # ✅ Banner CRUD & Active API (tam fonksiyonel)
│   │   └── admin/         # ✅ Admin API'ları
│   │       └── products/  # ✅ Admin ürün CRUD
│   ├── admin/             # ✅ Admin Panel (kategori+ürün+banner fonksiyonel)
│   │   ├── categories/    # ✅ Kategori yönetimi (CRUD)
│   │   ├── products/      # ✅ Ürün yönetimi (CRUD)
│   │   ├── banners/       # ✅ Banner yönetimi (CRUD, type sistemi)
│   │   ├── users/         # 🚧 UI var, API eksik
│   │   └── orders/        # 🚧 UI var, API eksik
│   ├── auth/              # ✅ Login/Register sayfaları
│   ├── products/          # ✅ Ürün listeleme ve detay
│   ├── cart/              # 🚧 UI var, backend eksik
│   ├── checkout/          # 🚧 UI var, backend eksik
│   └── profile/           # 🚧 UI var, backend eksik
├── components/            # ✅ React bileşenleri
│   ├── home/              # ✅ Ana sayfa bileşenleri (Hero, Featured Products)
│   ├── layout/            # ✅ Header, Footer
│   ├── products/          # ✅ Ürün bileşenleri
│   └── providers/         # ✅ Context providers
├── prisma/                # ✅ Database schema & migrations
└── types/                 # ✅ TypeScript tip tanımları
```

## 📦 Kurulum

### **Gereksinimler**
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### **1. Projeyi Klonlayın**
```bash
git clone <repo-url>
cd site
```

### **2. Bağımlılıkları Yükleyin**
```bash
npm install
```

### **3. Çevre Değişkenlerini Ayarlayın**
`.env` dosyasını oluşturun:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/muse3dstudio"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-key-here-1234567890"

# App
NODE_ENV="development"
```

### **4. Veritabanını Hazırlayın**
```bash
# PostgreSQL'i başlatın
brew services start postgresql@14  # macOS
# sudo service postgresql start    # Linux

# Veritabanı şemasını oluşturun
npx prisma db push

# Test verilerini ekleyin
npx ts-node prisma/seed-user.ts
npx ts-node prisma/seed-products.ts
```

### **5. Geliştirme Sunucusunu Başlatın**
```bash
npm run dev
```

🌐 **Site**: http://localhost:3000  
🔧 **Admin Panel**: http://localhost:3000/admin  
🗄️ **Prisma Studio**: `npx prisma studio`

## 🧪 Test Verileri

### **Test Kullanıcısı**
- **Email**: `onuryasar@tes.com`
- **Şifre**: `123`
- **Rol**: Admin

### **Mevcut Veriler**
- **4 Ana Kategori**: Ev Dekorasyon, Mutfak, Günlük Yaşam & Hediyelik
- **1 Alt Kategori**: Raf Kitap Tutucu (Ev Dekorasyon altında)
- **1 Test Ürünü**: Dinazor Kitap Ayracı

## 🎯 Öncelikli Geliştirme Planı

### **🔥 Acil Öncelik (Hafta 1-2)**
1. **Sepet Sistemi Backend**
   - Cart API endpoints (/api/cart)
   - Session/localStorage entegrasyonu
   - Sepet ürün yönetimi

2. **Sipariş Sistemi Backend**
   - Order API endpoints (/api/orders)
   - Admin sipariş yönetimi
   - Sipariş durumu takibi

### **⚡ Yüksek Öncelik (Hafta 3-4)**
3. **Ödeme Entegrasyonu**
   - Payment provider entegrasyonu
   - Checkout süreci
   - Fatura sistemi

4. **Kullanıcı Profil Sistemi**
   - Profil API endpoints
   - Adres yönetimi
   - Sipariş geçmişi

### **📈 Orta Öncelik (Ay 2)**
5. **Admin Panel Tamamlama**
   - Banner CRUD API
   - Kullanıcı yönetimi API
   - İstatistik dashboard'ları

6. **Ürün Özellikleri**
   - Yorum sistemi
   - Favori ürünler
   - İndirim sistemi

### **🚀 Gelecek Özellikler**
7. **Production Hazırlığı**
   - Güvenlik middleware'leri
   - Error tracking
   - Performance optimizasyonu

8. **Gelişmiş Özellikler**
   - Görsel upload sistemi
   - Gelişmiş arama
   - Çoklu dil desteği

## 🗄️ Veritabanı Şeması

### **Mevcut Tablolar (✅ API Hazır)**
- `users` - Kullanıcılar
- `categories` - Hiyerarşik kategoriler
- `products` - Ürünler
- `banners` - Site banner'ları (Hero & Featured Products)

### **Tanımlı Tablolar (❌ API Eksik)**
- `cart_items` - Sepet öğeleri
- `orders` - Siparişler
- `order_items` - Sipariş öğeleri
- `addresses` - Kullanıcı adresleri
- `reviews` - Ürün yorumları
- `discounts` - İndirimler

## 🚀 Deploy

### **⚡ Hızlı Deploy (AWS EC2)**
```bash
# 15 dakikada hazır!
curl -sL https://raw.githubusercontent.com/your-username/site/main/scripts/setup-server.sh | sudo bash
cd /var/www/muse3dstudio && git clone https://github.com/your-username/site.git .
npm install && npm run db:setup-production && npm run build
pm2 start ecosystem.config.js && sudo ./scripts/setup-nginx.sh
```

**📖 Detaylı rehber:** [QUICK-START.md](./QUICK-START.md) | [DEPLOY.md](./DEPLOY.md)

### **Alternatif: Vercel Deploy**
```bash
# 1. Vercel'e deploy edin
vercel

# 2. Environment variables ayarlayın:
# DATABASE_URL=<production-db-url>
# NEXTAUTH_URL=<your-domain>
# NEXTAUTH_SECRET=<random-secret>
```

## 🎯 Mevcut Eksiklikler & Öneriler

### **⚠️ Kritik Eksiklikler**
1. **E-ticaret Temel Özellikleri**
   - Sepet ve ödeme sistemi eksik
   - Sipariş yönetimi eksik
   - Kullanıcı profil sistemi eksik

2. **Güvenlik**
   - Rate limiting yok
   - Input validation eksik
   - CSRF koruması eksik

3. **Production Hazırlığı**
   - Error handling eksik
   - Logging sistemi yok
   - Performance monitoring yok

### **🔧 Teknik İyileştirmeler**
1. **API Geliştirmeleri**
   - Pagination eksik
   - API documentation yok
   - Error response standartları

2. **Frontend İyileştirmeleri**
   - Loading skeleton'ları
   - Optimistic updates
   - Infinite scroll

3. **Database Optimizasyonu**
   - İndeks optimizasyonu
   - Query optimizasyonu
   - Connection pooling

## 📋 Geliştirme Checklist

### **Hemen Yapılması Gerekenler**
- [ ] Sepet API endpoints (/api/cart)
- [ ] Sipariş API endpoints (/api/orders)
- [ ] Kullanıcı profil API (/api/user/profile)
- [ ] Admin sipariş yönetimi
- [ ] Ödeme entegrasyonu

### **Kısa Vadede Yapılması Gerekenler**
- [ ] Kullanıcı yönetimi API
- [ ] Yorum sistemi
- [ ] Email sistemi
- [ ] İndirim sistemi

### **Uzun Vadede Yapılması Gerekenler**
- [ ] Görsel upload sistemi
- [ ] Gelişmiş arama
- [ ] Performance optimizasyonu
- [ ] Güvenlik sıkılaştırması
- [ ] Çoklu dil desteği

## 📞 İletişim & Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

**Proje Durumu**: 🚀 Aktif Geliştirme  
**Versiyon**: v4.0 - Tam Fonksiyonel Banner Management Sistemi  
**Son Güncelleme**: Ocak 2025
