# HappyBee - 3D Ürünler E-Ticaret Sitesi

Bu proje, 3D ürünler satışı için modern, modüler ve özelleştirilebilir bir e-ticaret platformudur. Next.js, TypeScript, Tailwind CSS ve Prisma ile geliştirilmiştir.

## 🚀 Mevcut Özellikler

### ✅ **Çalışan Sistemler**
- **🔐 Kullanıcı Giriş/Kayıt**: NextAuth ile tam fonksiyonel
- **📦 Ürün Sistemi**: API'dan dinamik veri çekme
- **🏷️ Hiyerarşik Kategori Sistemi**: Ana kategori → Alt kategori desteği
- **🎯 Modern Filtreleme**: Buton tabanlı kategori seçimi ve gelişmiş filtreler
- **⚙️ Admin Panel**: Tam fonksiyonel CRUD işlemleri (Kategori, Ürün, Kullanıcı, Banner)
- **🔍 Arama ve Filtreleme**: Fiyat aralığı, kategori, alt kategori, sıralama
- **📱 Responsive Tasarım**: Mobil uyumlu
- **⚡ Gerçek Zamanlı Veri**: PostgreSQL veritabanı bağlantısı

### 🎨 **Tasarım Özellikleri**
- Modern ve responsive tasarım
- Buton tabanlı kategori filtreleri (radio button yerine)
- Expand/collapse alt kategori sistemı
- Özelleştirilebilir renk paleti (Tailwind CSS)
- Dinamik kategori kartları
- Loading ve error state'leri
- Smooth animasyonlar ve hover efektleri
- Global CSS sınıfları (admin-input, admin-textarea, admin-select)

### 🗄️ **Veritabanı ve API**
- **PostgreSQL** veritabanı
- **Prisma ORM** ile type-safe veritabanı işlemleri
- **Hiyerarşik Kategori Yapısı**: parentId ile alt kategori desteği
- RESTful API endpoints:
  - `GET /api/products` - Ürün listeleme + filtreleme
  - `GET /api/products/[slug]` - Ürün detayı
  - `GET /api/categories` - Hiyerarşik kategori listeleme
  - `POST /api/categories` - Kategori oluşturma (alt kategori desteği)
  - `GET /api/categories/[id]` - Tekil kategori bilgisi
  - `PUT /api/categories/[id]` - Kategori güncelleme
  - `DELETE /api/categories/[id]` - Kategori silme (koruma kontrolü)
  - `POST /api/auth/register` - Kullanıcı kayıt
  - `POST /api/auth/...` - Kullanıcı yönetimi

### ⚙️ **Admin Panel Özellikleri**
- **Dashboard**: Genel istatistikler ve özet bilgiler
- **Kategori Yönetimi**: 
  - Hiyerarşik kategori oluşturma (ana/alt kategori)
  - CRUD işlemleri (Oluştur, Oku, Güncelle, Sil)
  - Kategori istatistikleri ve alt kategori sayısı
  - Slug otomatik oluşturma (Türkçe karakter desteği)
- **Ürün Yönetimi**: Ürün CRUD işlemleri (UI tamamlandı)
- **Kullanıcı Yönetimi**: Kullanıcı listeleme ve detayları
- **Banner Yönetimi**: Site banner'ları için CRUD
- **Modern Form Tasarımı**: Tutarlı stil ve UX

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
🔧 **Admin Panel**: http://localhost:3000/admin  
🗄️ **Prisma Studio**: http://localhost:5555 (opsiyonel)

## 🔧 Test Kullanıcısı
- **Email**: `onuryasar@tes.com`
- **Şifre**: `123`

## 📊 Mevcut Veriler
- **6 Ana Kategori**: Mimari, Karakter, Araç, Mobilya, Elektronik, Doğa
- **Alt Kategoriler**: Test için "Modern Evler", "Klasik Binalar" (Mimari alt kategorileri)
- **12 Ürün**: Her kategoride 2'şer ürün
- **Test Kullanıcı**: Giriş için hazır

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # NextAuth + Register
│   │   ├── products/      # Ürün API'ları
│   │   └── categories/    # Hiyerarşik kategori API'ları
│   ├── products/          # Ürün sayfaları
│   ├── auth/              # Giriş/kayıt
│   ├── admin/             # Tam fonksiyonel admin panel
│   │   ├── categories/    # Kategori CRUD
│   │   ├── products/      # Ürün yönetimi
│   │   ├── users/         # Kullanıcı yönetimi
│   │   └── banners/       # Banner yönetimi
│   ├── cart/              # Sepet sayfası
│   ├── checkout/          # Ödeme sayfası
│   └── profile/           # Kullanıcı profili
├── components/            # React bileşenleri
│   ├── home/              # Ana sayfa bileşenleri
│   ├── layout/            # Header, Footer
│   ├── products/          # Ürün bileşenleri + modern filtreler
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
- [x] Kullanıcı authentication (giriş + kayıt)
- [x] Ürün listeleme ve filtreleme
- [x] Hiyerarşik kategori sistemi (ana/alt kategori)
- [x] Buton tabanlı modern filtreler
- [x] Admin panel - Kategori CRUD (tam fonksiyonel)
- [x] Admin panel UI tasarımları (ürün, kullanıcı, banner)
- [x] Responsive tasarım
- [x] API endpoints (tam CRUD)
- [x] Veritabanı entegrasyonu
- [x] Global CSS sınıfları ve temiz kod yapısı
- [x] TypeScript tip güvenliği

### 🔄 **Geliştirme Aşamasında**
- [ ] Admin panel - Ürün CRUD backend entegrasyonu
- [ ] Admin panel - Kullanıcı yönetimi backend
- [ ] Admin panel - Banner sistemi backend
- [ ] Sepet sistemi backend entegrasyonu
- [ ] Ödeme entegrasyonu
- [ ] Gerçek ürün görselleri upload sistemi
- [ ] Email sistemi

### 💡 **Gelecek Özellikler**
- [ ] Ürün yorumları ve puanlama
- [ ] Favori ürünler
- [ ] Görsel upload sistemi
- [ ] Çoklu dil desteği
- [ ] İstatistik dashboard'ları
- [ ] Gelişmiş arama (ElasticSearch)

## 🆕 **Son Güncellemeler (v2.0)**
- 🎯 **Hiyerarşik Kategori Sistemi**: Ana kategori → Alt kategori desteği
- 🎨 **Modern Filtre Tasarımı**: Radio button'lardan buton tabanlı sistem'e geçiş  
- ⚙️ **Tam Fonksiyonel Admin Panel**: Kategori CRUD tamamen çalışır durumda
- 🏗️ **API Genişletmesi**: Hiyerarşik veri yapısı ve gelişmiş endpoint'ler
- 🎭 **CSS Optimizasyonu**: Global sınıflar ve temiz kod yapısı
- 🔧 **TypeScript İyileştirmeleri**: Tam tip güvenliği

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

**Proje Durumu**: 🚀 Aktif Geliştirme (v2.0 - Hiyerarşik Kategori Sistemi)
