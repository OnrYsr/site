# Muse3DStudio - 3D Ürünler E-Ticaret Platformu

Modern, ölçeklenebilir ve tam özellikli e-ticaret platformu. Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL ve Docker ile geliştirilmiştir.

## 🌐 **LIVE PRODUCTION SITE**

### **✅ Canlı Site URL'leri:**
- **🔗 Ana Site**: [https://muse3dstudio.com](https://muse3dstudio.com)
- **🔗 www Subdomain**: [https://www.muse3dstudio.com](https://www.muse3dstudio.com)
- **⚙️ Admin Panel**: [https://muse3dstudio.com/auth/login](https://muse3dstudio.com/auth/login)
- **🏥 Health Check**: [https://muse3dstudio.com/api/health](https://muse3dstudio.com/api/health)

### **🍓 Raspberry Pi Production Altyapısı:**
- **🖥️ Hardware**: Raspberry Pi 4/5 (4GB RAM, ARM64)
- **☁️ Global Access**: Cloudflare Tunnel (Zero Trust Network)
- **🔒 SSL/TLS**: Full encryption via Cloudflare (HTTPS everywhere)
- **🐳 Database**: PostgreSQL 16 + Redis 7 (Docker containers)
- **⚡ Application**: Next.js 15 (Native systemd service)
- **🔄 CI/CD**: GitHub Actions → SSH tunnel → Auto deployment
- **📊 Monitoring**: Systemd services + Docker healthchecks

### **🌐 Network & Security:**
- **🔗 SSH Tunnel**: `ssh.muse3dstudio.com` (GitHub Actions access)
- **🛡️ DDoS Protection**: Cloudflare Enterprise-level protection
- **🚀 Global CDN**: 200+ edge locations worldwide
- **⚡ Performance**: 239 Mbps Ethernet, 5ms ping
- **🔐 Zero Trust**: No direct IP exposure, tunnel-only access

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

### **🤖 Automated CI/CD (Recommended)**
Kod push ettiğinizde otomatik deployment:
```bash
git add .
git commit -m "feat: new feature"
git push origin main
# 🚀 GitHub Actions otomatik olarak Pi'ye deploy eder!
```

### **🍓 Raspberry Pi Commands**
```bash
# Pi'ye manuel deployment
RPI_HOST=192.168.1.8 RPI_USER=muse3dstudio make rpi-deploy

# Pi servis durumu
RPI_HOST=192.168.1.8 RPI_USER=muse3dstudio make rpi-status

# Pi health check
RPI_HOST=192.168.1.8 make rpi-health

# Pi logları izle
RPI_HOST=192.168.1.8 RPI_USER=muse3dstudio make rpi-logs
```

### **📋 Pi Deployment Guide**
Detaylı Raspberry Pi kurulum ve deployment rehberi:
- **📖 Complete Guide**: [RASPBERRY-PI-DEPLOYMENT.md](RASPBERRY-PI-DEPLOYMENT.md)
- **🔧 Setup Script**: `scripts/setup-rpi.sh`
- **⚙️ Systemd Services**: `systemd/` klasörü

### **Environment Variables**
Raspberry Pi production ortamı için `.env` dosyası:
```bash
# Production Database (Pi)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/muse3dstudio"

# NextAuth Configuration (HTTPS)
NEXTAUTH_URL="https://muse3dstudio.com"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Cloudflare Tunnel
CLOUDFLARE_TUNNEL_TOKEN="your-tunnel-token-here"

# Pi Performance Optimization
NODE_OPTIONS="--max-old-space-size=512"

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

**📅 Last Updated**: August 1, 2024  
**🏷️ Version**: 1.1.0 Production  
**👨‍💻 Developed by**: Muse3DStudio Team

## 📊 **CURRENT STATUS** (Updated: Aug 1, 2024)

### ✅ **Recently Implemented Features:**

#### 🔒 **Private Mode System** 
- **PrivateWrapper**: Site-wide session protection
- **ConditionalLayout**: Auth pages header/footer management  
- **Registration Disabled**: Temporary private beta mode
- **Login Required**: All pages require authentication

#### 🛒 **isSaleActive Product Feature**
- **Database**: `isSaleActive` field added to Product model
- **Admin Panel**: New checkbox in product edit/create forms
- **Frontend**: "Satışa Kapalı" badge + disabled cart buttons
- **API**: Full CRUD support for sale status management

#### 🛡️ **Enhanced Admin Security**
- **Role-based Access**: ADMIN role verification
- **Clean UI**: Redundant admin header removed
- **Session Protection**: Double authentication layer

### 🚀 **Current Deployment Status:**

#### ✅ **Production Server** (Manual Deploy)
- **Method**: Manual Git clone to Raspberry Pi
- **Status**: ✅ **LIVE** - https://muse3dstudio.com
- **Health**: ✅ API responding (200 OK)
- **Features**: ✅ Private mode + isSaleActive active

#### ⚠️ **GitHub Actions CI/CD**
- **Status**: ❌ **FAILED** (Last automated deploy failed)
- **Issue**: Build errors in local branch
- **Solution**: Manual deployment used as workaround

#### 📍 **Local Development**
- **Status**: ⚠️ **HAS ISSUES** (Header undefined, JWT errors)
- **Action**: Needs clean repository pull
- **Fix**: `git clone` fresh copy recommended

### 🎯 **Next Priority Actions:**

1. **🔧 Fix Local Development**
```bash
   # Clean local environment
   cd /Users/home/Desktop
   mv site site-backup
   git clone https://github.com/OnrYsr/site.git site
   ```

2. **🤖 Repair GitHub Actions**
   - Fix build errors
   - Test automated deployment pipeline
   - Restore CI/CD functionality

3. **📊 Test Production Features**
   - Verify isSaleActive works end-to-end
   - Test private mode user flows
   - Admin panel functionality check

4. **🚀 Performance Optimization**
   - Database seeding with new structured data
   - Production monitoring setup
   - Error tracking implementation

### 📈 **Production Metrics:**
- **Uptime**: ✅ 99.9% (Cloudflare CDN)
- **Performance**: ⚡ 239 Mbps Pi connection  
- **Security**: 🔒 Zero Trust + Private mode
- **Global Access**: 🌍 200+ CDN locations

---

## 🚀 Deployment Guidelines

### ❌ **NEVER DO ON PRODUCTION SERVER:**
- `npm install` directly on server
- Manual dependency management
- Direct file edits on production

### ✅ **CORRECT DEPLOYMENT FLOW:**
1. **GitHub Actions** handles automatic deployment
2. If Actions fails → Check logs first
3. **Manual deployment ONLY via:**
   - `./scripts/deploy-production.sh`
   - `docker-compose -f docker-compose.prod.yml up -d --build`
   - Existing automation scripts

### 🔄 **Current Deployment Status Check:**
```bash
# Check if site is running
curl -I https://muse3dstudio.com

# Check Docker containers
docker ps

# Check GitHub Actions
# Visit: https://github.com/OnrYsr/site/actions
```

**Remember: Production uses Docker + GitHub Actions, NOT manual npm commands!**
