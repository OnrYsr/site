# Muse3DStudio - 3D Ürünler E-Ticaret Platformu

Modern, ölçeklenebilir ve tam özellikli e-ticaret platformu. Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL ve Docker ile geliştirilmiştir.

## 🌐 **LIVE PRODUCTION SITE**

### **✅ Canlı Site URL'leri:**
- **🔗 Ana Site**: [http://muse3dstudio.com](http://muse3dstudio.com)
- **🔗 www Subdomain**: [http://www.muse3dstudio.com](http://www.muse3dstudio.com)
- **⚙️ Admin Panel**: [http://muse3dstudio.com/admin](http://muse3dstudio.com/admin)
- **🔧 Direct IP Access**: [http://13.60.88.122:3000](http://13.60.88.122:3000)

### **🚀 Production Altyapısı:**
- **☁️ Cloud Provider**: AWS EC2 (t3.micro, Ubuntu 24.04)
- **🐳 Containerization**: Docker Compose (Multi-stage production build)
- **🌐 Web Server**: Nginx (Reverse Proxy, Port 80 → 3000)
- **🗄️ Database**: PostgreSQL 16+ (Docker container, persistent volume)
- **💾 Cache**: Redis (Docker container, persistent volume)
- **🔒 SSL Certificate**: Let's Encrypt (Coming Soon)
- **📊 Process Management**: Docker healthchecks & auto-restart

### **📡 Server Specifications:**
- **IP Address**: `13.60.88.122`
- **Operating System**: Ubuntu 24.04 LTS
- **RAM**: 1GB (+ 2GB Swap for builds)
- **Storage**: SSD with Docker volumes
- **Network**: Auto-scaling security groups

---

## 🚀 Yeni Geliştirme Ortamı (Docker & Makefile)

Proje, tek komutla kurulabilen, izole ve tutarlı bir geliştirme ortamı sağlamak için Docker ve Makefile kullanır.

- **Tek Komutla Kurulum**: `make setup` ile tüm ortamı saniyeler içinde kurun.
- **İzole Ortam**: Docker sayesinde, projenin tüm bağımlılıkları (PostgreSQL, Redis) container'lar içinde çalışır.
- **Kolay Yönetim**: `Makefile` ile servisleri başlatma, durdurma, logları izleme ve veritabanını yönetme gibi işlemler basitleştirilmiştir.
- **Production Sync**: `make sync-from-prod` ile production verisini local'e çekebilirsiniz.
- **Detaylı Doküman**: Yeni geliştirme süreci için [DEV-WORKFLOW.md](DEV-WORKFLOW.md) dosyasına göz atın.

---

## ⚡ Hızlı Başlangıç

### **Gereksinimler**
- Docker & Docker Compose
- Node.js 20+
- `make` komutu (macOS ve Linux'ta varsayılan olarak bulunur)

### **1. Projeyi Klonlayın**
```bash
git clone https://github.com/your-username/muse3dstudio.git
cd muse3dstudio
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

# Production verilerini local'e sync et
make sync-from-prod

# Tüm ortamı temizle (container'lar, volume'ler)
make clean
```

## 🚢 Production Deployment

### **Production Build & Deploy**
```bash
# Production build (sunucuda)
make prod-build

# Database setup (ilk kurulum)
make db-setup

# Sistem durumu kontrol
docker ps
docker logs muse3d_app
```

### **Quick Deploy Scripts**
```bash
# Hızlı production deploy
npm run deploy:quick

# Manual production sync
rsync -av --exclude='node_modules' --exclude='.next' --exclude='.git' . ubuntu@13.60.88.122:/var/www/muse3dstudio/
```

### **Environment Variables**
Production ortamı için `.env` dosyası:
```bash
# Production Database
DATABASE_URL="postgresql://postgres:@localhost:5432/muse3dstudio"

# NextAuth Configuration  
NEXTAUTH_URL="http://muse3dstudio.com"
NEXTAUTH_SECRET="your-production-secret-key"

# App Environment
NODE_ENV="production"
```

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
- **PostgreSQL 16** - Ana veritabanı
- **Redis 7** - Cache ve session storage
- **NextAuth.js** - Kimlik doğrulama
- **bcryptjs** - Şifre hash'leme

### **DevOps & Altyapı**
- **Docker & Docker Compose** - Multi-stage container builds
- **Nginx** - Reverse proxy ve load balancer
- **AWS EC2** - Cloud hosting
- **Makefile** - Geliştirme otomasyonu
- **GitHub** - Version control
- **ESLint** - Kod linting
- **Prisma Studio** - Veritabanı GUI

## 📁 Proje Yapısı

Proje yapısı hakkında detaylı bilgi ve geliştirme kuralları için `.cursorrules` dosyasına göz atın.
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API endpoints
│   ├── admin/             # Admin panel pages
│   └── (public)/          # Public pages
├── components/             # Reusable React components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   └── [feature]/         # Feature-specific components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
└── utils/                 # Helper functions

prisma/
├── schema.prisma          # Database schema
├── migrations/            # Database migrations
├── seed-products.ts       # Product seeding
└── seed-admin.ts         # Admin user seeding

scripts/
├── deploy-production.sh   # Production deployment
├── sync-production.sh     # Database sync
├── setup-server.sh       # Server setup
└── make-admin.js         # Admin user creation
```

## 🔧 Database Management

### **Migration & Seeding**
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Seed database with sample data
npm run db:seed:products
npm run db:seed:admin

# Create admin user
npm run create:admin
```

### **Production Database Sync**
```bash
# Sync production data to local
make sync-from-prod

# Manual database dump (on server)
pg_dump postgresql://postgres:@localhost:5432/muse3dstudio > backup.sql
```

## 🌐 Domain & DNS Configuration

### **DNS Settings (GoDaddy)**
```
Type    Name    Value           TTL
A       @       13.60.88.122    600
CNAME   www     muse3dstudio.com    600
```

### **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name muse3dstudio.com www.muse3dstudio.com;

    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🎯 Sonraki Adımlar

1. **🔒 SSL Certificate**: Let's Encrypt ile HTTPS kurulumu
2. **📊 Monitoring**: Logging ve error tracking
3. **🔄 CI/CD Pipeline**: GitHub Actions ile otomatik deployment
4. **🧪 Testing**: Jest, React Testing Library, Cypress testleri
5. **🚀 Performance**: CDN, caching, image optimization
6. **📱 Mobile App**: React Native veya PWA
7. **💳 Payment Integration**: Stripe, PayPal entegrasyonu
8. **📧 Email Service**: SMTP configuration
9. **🔍 SEO Optimization**: Meta tags, sitemap, analytics
10. **📈 Analytics**: Google Analytics, user tracking

## 📞 Support & Contact

- **🐛 Bug Reports**: GitHub Issues
- **💡 Feature Requests**: GitHub Discussions  
- **📧 Contact**: info@muse3dstudio.com
- **🌐 Website**: [muse3dstudio.com](http://muse3dstudio.com)

---

**📅 Last Updated**: July 28, 2024  
**🏷️ Version**: 1.0.0 Production  
**👨‍💻 Developed by**: Muse3DStudio Team
