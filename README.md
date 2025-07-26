# Muse3DStudio - 3D Ürünler E-Ticaret Platformu

Modern, ölçeklenebilir ve tam özellikli e-ticaret platformu. Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL ve Docker ile geliştirilmiştir.

## 🚀 Yeni Geliştirme Ortamı (Docker & Makefile)

Proje, tek komutla kurulabilen, izole ve tutarlı bir geliştirme ortamı sağlamak için Docker ve Makefile kullanır.

- **Tek Komutla Kurulum**: `make setup` ile tüm ortamı saniyeler içinde kurun.
- **İzole Ortam**: Docker sayesinde, projenin tüm bağımlılıkları (PostgreSQL, Redis) container'lar içinde çalışır.
- **Kolay Yönetim**: `Makefile` ile servisleri başlatma, durdurma, logları izleme ve veritabanını yönetme gibi işlemler basitleştirilmiştir.
- **Detaylı Doküman**: Yeni geliştirme süreci için [DEV-WORKFLOW.md](DEV-WORKFLOW.md) dosyasına göz atın.

---

## ⚡ Hızlı Başlangıç

### **Gereksinimler**
- Docker & Docker Compose
- Node.js 20+
- `make` komutu (macOS ve Linux'ta varsayılan olarak bulunur)

### **1. Projeyi Klonlayın**
```bash
git clone <repo-url>
cd site
```

### **2. Tek Komutla Kurulum**
Bu komut, tüm bağımlılıkları yükler, Docker servislerini başlatır ve veritabanını hazırlar.
```bash
make setup
```

### **3. Servislere Erişin**
Kurulum tamamlandığında aşağıdaki adreslerden servislere ulaşabilirsiniz:
- **Uygulama**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Prisma Studio (Veritabanı Arayüzü)**: http://localhost:5555
- **Sağlık Kontrolü (Health Check)**: http://localhost:3000/api/health

## 🛠️ Temel Geliştirme Komutları

Tüm komutları görmek için `make help` çalıştırın.
```bash
# Geliştirme ortamını başlat
make dev

# Geliştirme ortamını durdur
make down

# Uygulama loglarını izle
make logs

# Veritabanını sıfırla ve yeniden seed et
make db-reset

# Tüm ortamı temizle (container'lar, volume'ler)
make clean
```
---

## 🌐 **LIVE PRODUCTION SITE**

### **✅ Canlı Site URL'leri:**
- **🔒 Ana Site**: [https://muse3dstudio.com](https://muse3dstudio.com)
- **🔒 www Subdomain**: [https://www.muse3dstudio.com](https://www.muse3dstudio.com)
- **⚙️ Admin Panel**: [https://muse3dstudio.com/admin](https://muse3dstudio.com/admin)

### **🚀 Production Altyapısı:**
- **☁️ Cloud Provider**: AWS EC2 (t3.micro)
- **🐳 Containerization**: Docker Compose
- **🔄 Process Manager**: PM2 (Legacy - Yakında Docker'a geçirilecek)
- **🗄️ Database**: PostgreSQL 16+
- **🌐 Web Server**: Nginx (Reverse Proxy)
- **🔒 SSL Certificate**: Let's Encrypt

---

## 🛠️ Teknoloji Stack'i

### **Frontend**
- **Next.js 15** - React framework (App Router)
- **TypeScript** - Tip güvenliği
- **Tailwind CSS 4** - Modern stil aracı
- **Lucide React** - İkon kütüphanesi
- **Framer Motion** - Animasyonlar
- **React Hook Form & Zod** - Form yönetimi ve validasyon

### **Backend**
- **Next.js API Routes** - Backend API
- **Prisma ORM** - Veritabanı ORM'i
- **PostgreSQL** - Ana veritabanı
- **NextAuth.js** - Kimlik doğrulama
- **bcryptjs** - Şifre hash'leme

### **Altyapı & Geliştirme Araçları**
- **Docker & Docker Compose** - Container yönetimi
- **Makefile** - Geliştirme otomasyonu
- **ESLint** - Kod linting
- **Prisma Studio** - Veritabanı GUI
- **tsx** - Gelişmiş TypeScript çalıştırıcısı

## 📁 Proje Yapısı

Proje yapısı hakkında detaylı bilgi ve geliştirme kuralları için `.cursorrules` dosyasına göz atın.
```
src/
├── app/                    # Next.js App Router (API, Admin, Public sayfalar)
├── components/             # Tekrar kullanılabilir React bileşenleri
├── prisma/                 # Veritabanı şeması, migration ve seed dosyaları
└── types/                  # TypeScript tip tanımları
```
---

## 🎯 Sonraki Adımlar

1.  **Production Ortamını Docker'a Geçirme**: Sunucudaki PM2 tabanlı sistemi tamamen Docker Compose ile değiştirmek.
2.  **CI/CD Pipeline**: GitHub Actions ile otomatik test ve deployment süreçleri oluşturmak.
3.  **Test Altyapısı**: Jest ve React Testing Library ile unit/integration testleri, Cypress ile E2E testleri eklemek.
4.  **Gelişmiş Özellikler**: Sepet, ödeme, ürün yorumları gibi eksik e-ticaret özelliklerini tamamlamak.
5.  **Monitoring**: Sentry gibi araçlarla hata takibi ve performans izleme eklemek.
