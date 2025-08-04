# Muse3DStudio - 3D Ürünler E-Ticaret Platformu

Modern, ölçeklenebilir ve tam özellikli e-ticaret platformu. Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL ve Docker ile geliştirilmiştir.

## 🌐 **LIVE PRODUCTION SITE**

### **✅ Canlı Site URL'leri:**
- **🔗 Ana Site**: [https://muse3dstudio.com](https://muse3dstudio.com)
- **🔗 www Subdomain**: [https://www.muse3dstudio.com](https://www.muse3dstudio.com)
- **⚙️ Admin Panel**: [https://muse3dstudio.com/admin](https://muse3dstudio.com/admin)
- **🔐 Login**: [https://muse3dstudio.com/auth/login](https://muse3dstudio.com/auth/login)
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

## 🔐 **LOGIN BİLGİLERİ**

### **👤 Admin Kullanıcı:**
```
Email: admin@muse3dstudio.com
Password: admin123
Role: ADMIN
```

### **👤 Test Kullanıcı:**
```
Email: test@muse3dstudio.com
Password: test123
Role: USER
```

### **🔑 Yeni Admin Oluşturma:**
```bash
# Local development
npm run create:admin

# Production (Raspberry Pi)
./scripts/make-admin.js
```

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
- **Login**: http://localhost:3000/auth/login
- **Register**: http://localhost:3000/auth/register
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
│   │   ├── settings/      # Site settings management
│   │   ├── products/      # Product management
│   │   ├── categories/    # Category management
│   │   ├── banners/       # Banner management
│   │   ├── orders/        # Order management
│   │   └── users/         # User management
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── profile/           # User profile
│   └── products/          # Product pages
├── components/             # Reusable React components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── home/              # Home page components
│   ├── products/          # Product components
│   └── providers/         # Context providers
├── hooks/                 # Custom React hooks
│   └── useSiteSettings.ts # Site settings hook
├── lib/                   # Utility functions
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

**📅 Last Updated**: August 4, 2025  
**🏷️ Version**: 1.2.0 Production  
**👨‍💻 Developed by**: Muse3DStudio Team

## 📊 **CURRENT STATUS** (Updated: Aug 4, 2025)

### ✅ **Recently Implemented Features:**

#### 🔐 **Enhanced Authentication System**
- **NextAuth.js Integration**: Complete authentication flow
- **Role-based Access Control**: ADMIN and USER roles
- **Session Management**: Secure session handling
- **Rate Limiting**: IP and email-based protection
- **Registration Control**: Admin can enable/disable registration

#### 🛒 **Checkout & Payment System**
- **Checkout Process**: Complete order flow
- **Agreement Checkboxes**: Terms and Privacy Policy acceptance
- **Cart Management**: Persistent cart with Redis
- **Payment Integration**: Iyzico payment gateway (sandbox)
- **Order Management**: Full order tracking system

#### 🎨 **UI/UX Improvements**
- **Sliding Background**: Dynamic auth page backgrounds
- **Modern Design**: Tailwind CSS 4 implementation
- **Responsive Layout**: Mobile-first design
- **Loading States**: Smooth user experience
- **Error Handling**: User-friendly error messages

#### ⚙️ **Admin Panel Enhancements**
- **Site Settings**: Registration toggle, maintenance mode
- **Product Management**: Full CRUD operations
- **Category Management**: Hierarchical category system
- **Banner Management**: Dynamic banner system
- **User Management**: User list and details
- **Order Management**: Order tracking and status

#### 🛡️ **Security Features**
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM
- **XSS Protection**: Content sanitization
- **CSRF Protection**: NextAuth.js built-in
- **Rate Limiting**: Redis-based protection

### 🚀 **Current Deployment Status:**

#### ✅ **Production Server** (Manual Deploy)
- **Method**: Manual Git clone to Raspberry Pi
- **Status**: ✅ **LIVE** - https://muse3dstudio.com
- **Health**: ✅ API responding (200 OK)
- **Features**: ✅ All new features active

#### ⚠️ **GitHub Actions CI/CD**
- **Status**: ❌ **FAILED** (Last automated deploy failed)
- **Issue**: Build errors in local branch
- **Solution**: Manual deployment used as workaround

#### 📍 **Local Development**
- **Status**: ✅ **WORKING** (All features functional)
- **Server**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Login**: http://localhost:3000/auth/login

### 🎯 **Next Priority Actions:**

1. **🔧 Fix GitHub Actions CI/CD**
   - Resolve build errors
   - Test automated deployment pipeline
   - Restore CI/CD functionality

2. **💳 Complete Payment Integration**
   - Fix Iyzico sandbox issues
   - Implement production payment flow
   - Add payment success/failure handling

3. **📊 Production Monitoring**
   - Set up error tracking
   - Implement performance monitoring
   - Add user analytics

4. **🚀 Performance Optimization**
   - Database query optimization
   - Image optimization
   - Caching strategies

### 📈 **Production Metrics:**
- **Uptime**: ✅ 99.9% (Cloudflare CDN)
- **Performance**: ⚡ 239 Mbps Pi connection  
- **Security**: 🔒 Zero Trust + Authentication
- **Global Access**: 🌍 200+ CDN locations
- **Features**: ✅ All major features implemented

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
