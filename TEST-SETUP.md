# 🧪 Muse3DStudio Test Environment Setup

Bu rehber production'a deploy etmeden önce projeyi güvenli bir şekilde test etmenizi sağlar.

## 🎯 Test Stratejisi

### **1. Local Test Environment**
- Local development server (port 3000)
- Test database (muse3dstudio_test)
- Test environment variables

### **2. Staging Branch Test**  
- `test` branch ile ayrı kod versiyonu
- Test-specific configurations
- Production benzeri environment

## 🏠 Local Test Setup

### **Gereksinimler**
- Node.js 18+
- PostgreSQL 14+
- Git

### **1. Test Database Oluştur**
```bash
# PostgreSQL'e bağlan
psql postgres

# Test database oluştur
CREATE DATABASE muse3dstudio_test;
\q
```

### **2. Test Environment Ayarla**
```bash
# Ana dizinde
cp env.test.example .env.test

# Test environment'ı aktif et
export NODE_ENV=development
```

### **3. Test Database Migration**
```bash
# Test database için migration
DATABASE_URL="postgresql://postgres:@localhost:5432/muse3dstudio_test" npx prisma db push

# Test seed data ekle
DATABASE_URL="postgresql://postgres:@localhost:5432/muse3dstudio_test" npm run db:seed:products
```

### **4. Local Test Server Başlat**
```bash
# Development server (hot reload ile)
npm run dev

# Veya production build test et
npm run build
npm start
```

### **5. Test URL'leri**
- **Ana Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Test**: http://localhost:3000/api/products

## 🌿 Test Branch Strategy

### **Test Branch Oluştur**
```bash
# Ana branch'ten test branch oluştur
git checkout -b test
git push -u origin test
```

### **Test-Specific Changes**
Test branch'inde yapılacak değişiklikler:
- Test database connection strings
- Debug mode enabled
- Test data seeding scripts
- Performance monitoring disabled

## 🔄 Test Workflow

### **1. Local Test Phase**
```bash
# Değişiklikleri local test et
npm run dev
# Manuel test yap:
# ✅ Login/logout
# ✅ Ürün listeleme/ekleme
# ✅ Admin panel
# ✅ API endpoints
```

### **2. Build Test Phase** 
```bash
# Production build test et
npm run build
npm start

# Performance test
npm run test  # (eğer test yazılırsa)
```

### **3. Test Branch Deploy**
```bash
# Test branch'e push et
git add .
git commit -m "test: feature xyz testing"
git push origin test
```

## 📋 Pre-Production Checklist

### **✅ Functionality Tests**
- [ ] Kullanıcı kayıt/giriş çalışıyor
- [ ] Ürün CRUD operations
- [ ] Kategori yönetimi
- [ ] Banner yönetimi  
- [ ] Admin panel erişimi
- [ ] API endpoints response alıyor

### **✅ Performance Tests**
- [ ] Build başarılı (npm run build)
- [ ] Page load times < 3s
- [ ] Database queries optimized
- [ ] No console errors

### **✅ Security Tests**
- [ ] Environment variables secure
- [ ] Database password strong
- [ ] API rate limiting
- [ ] HTTPS ready

### **✅ Compatibility Tests**
- [ ] Desktop browsers (Chrome, Firefox, Safari)
- [ ] Mobile responsive
- [ ] Database connections stable
- [ ] PM2 process management

## 🚀 Production Deploy After Test

### **Test Başarılı ise:**
```bash
# Test branch'den main'e merge
git checkout main
git merge test
git push origin main

# Production deploy et
ssh muse3d
cd /var/www/muse3dstudio
git pull origin main
npm install
npm run build
pm2 restart muse3dstudio
```

## 🐛 Test Issues & Solutions

### **Common Test Issues:**

**1. Database Connection Error**
```bash
# Check PostgreSQL running
brew services start postgresql@14  # macOS
sudo service postgresql start      # Linux

# Check database exists
psql postgres -c "\l" | grep muse3dstudio_test
```

**2. Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**3. Build Errors**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**4. Environment Variables Not Loading**
```bash
# Check .env.test file exists
ls -la .env*

# Verify environment
echo $NODE_ENV
```

## 📊 Test Data Management

### **Test Database Reset**
```bash
# Reset test database
DATABASE_URL="postgresql://postgres:@localhost:5432/muse3dstudio_test" npx prisma db push --force-reset

# Re-seed test data
DATABASE_URL="postgresql://postgres:@localhost:5432/muse3dstudio_test" npm run db:seed:products
```

### **Test User Creation**
```bash
# Create test admin user
DATABASE_URL="postgresql://postgres:@localhost:5432/muse3dstudio_test" npm run db:seed:admin
```

---

## 🎯 Test Summary

Bu test setup ile:
- ✅ Production'a zarar vermeden test edebilirsiniz
- ✅ Güvenli development environment
- ✅ Systematic testing approach
- ✅ Easy rollback if issues

**Test et → Doğrula → Deploy et** 🚀 