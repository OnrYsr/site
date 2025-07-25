# 🧪 Muse3DStudio Server Test Environment

Bu rehber projeyi **sunucuda** test etmek için hazırlanmıştır. Production ile aynı environment'ta güvenli test yapabilirsiniz.

## 🎯 Sunucu Test Stratejisi

### **Neden Sunucuda Test?**
- ✅ Production ile **tamamen aynı environment**
- ✅ Aynı Ubuntu server, aynı PostgreSQL version
- ✅ Aynı network configuration
- ✅ Daha güvenilir test sonuçları
- ✅ Local environment farkları ortadan kalkar

### **Test vs Production Setup**
```
Production: http://16.171.140.155:3000 (Port 3000)
Test:       http://16.171.140.155:3001 (Port 3001)

Production DB: muse3dstudio
Test DB:       muse3dstudio_test
```

## 🚀 Server Test Kurulumu

### **1. Sunucuya Bağlan**
```bash
ssh muse3d
# veya: ssh -i ~/Downloads/esp32-iot-key.pem ubuntu@16.171.140.155
```

### **2. Test Database Oluştur**
```bash
# PostgreSQL'e bağlan
sudo -u postgres psql

# Test database oluştur
CREATE DATABASE muse3dstudio_test;
GRANT ALL PRIVILEGES ON DATABASE muse3dstudio_test TO postgres;
GRANT ALL PRIVILEGES ON DATABASE muse3dstudio_test TO muse3dstudio_user;
\q
```

### **3. Test Branch'i Sunucuya Clone Et**
```bash
cd /var/www/muse3dstudio

# Test branch'e geç
git fetch origin
git checkout test

# Test environment ayarla
cp env.test.example .env.test
```

### **4. Test Environment Build Et**
```bash
# Test dependencies
npm install

# Test database migration
DATABASE_URL="postgresql://postgres:@localhost:5432/muse3dstudio_test" npx prisma db push

# Test seed data
DATABASE_URL="postgresql://postgres:@localhost:5432/muse3dstudio_test" npm run db:seed:products

# Test build
cp .env.test .env
npm run build
```

### **5. Test Server Başlat (PM2)**
```bash
# Test PM2 ile başlat (port 3001)
cp .env.test .env
pm2 start ecosystem.test.config.js

# Status kontrol et
pm2 status
```

### **6. Nginx Test Proxy (Opsiyonel)**
Test için Nginx proxy eklemek isterseniz:

```bash
# Test nginx config ekle
sudo nano /etc/nginx/sites-available/muse3dstudio

# Ekleyin:
# Test environment (port 3001)
location /test {
    rewrite ^/test(.*) $1 break;
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Nginx reload
sudo nginx -t && sudo systemctl reload nginx
```

## 🎯 Test URL'leri

### **Direct Test Access:**
- **Ana Site (Test)**: http://16.171.140.155:3001
- **Admin Panel (Test)**: http://16.171.140.155:3001/admin
- **API Test**: http://16.171.140.155:3001/api/products

### **Nginx Proxy (opsiyonel):**
- **Test via Nginx**: http://16.171.140.155/test

### **Production (karşılaştırma için):**
- **Ana Site (Production)**: http://16.171.140.155:3000
- **Admin Panel (Production)**: http://16.171.140.155:3000/admin

## 🔄 Test Workflow

### **Test Döngüsü:**
```bash
# 1. Test branch'te değişiklik yap (local)
git checkout test
# [kod değişiklikleri yap]
git commit -m "test: new feature"
git push origin test

# 2. Sunucuda test et
ssh muse3d
cd /var/www/muse3dstudio
git pull origin test
npm install
npm run build
pm2 restart muse3dstudio-test

# 3. Test URL'lerini kontrol et
curl http://16.171.140.155:3001
curl http://16.171.140.155:3001/api/products

# 4. Manuel test yap
# - Browser'da test URL'lerine git
# - Login/logout test et
# - Admin panel test et
# - Ürün CRUD operations

# 5. Test başarılıysa production'a merge et
git checkout main
git merge test
git push origin main
pm2 restart muse3dstudio  # Production restart
```

## 📋 Server Test Checklist

### **✅ Functionality Tests (Port 3001)**
- [ ] Site açılıyor: http://16.171.140.155:3001
- [ ] Kullanıcı kayıt/giriş çalışıyor
- [ ] Ürün listeleme çalışıyor
- [ ] Admin panel erişimi: http://16.171.140.155:3001/admin
- [ ] API response alıyor: http://16.171.140.155:3001/api/products
- [ ] Database operations (CRUD)

### **✅ Performance Tests**
- [ ] Build başarılı (`npm run build`)
- [ ] PM2 process stable (`pm2 status`)
- [ ] Memory usage normal (< 512MB for test)
- [ ] No critical console errors

### **✅ Compatibility Tests**
- [ ] Production ile aynı functionality
- [ ] Database isolation (test verisi production'ı etkilemiyor)
- [ ] Port isolation (3001 ↔ 3000 çakışmıyor)

## 🔧 Test Management Commands

### **PM2 Test Commands:**
```bash
# Test server durumu
pm2 status muse3dstudio-test

# Test server restart
pm2 restart muse3dstudio-test

# Test server stop
pm2 stop muse3dstudio-test

# Test server logs
pm2 logs muse3dstudio-test

# Test server delete
pm2 delete muse3dstudio-test
```

### **Database Test Commands:**
```bash
# Test database reset
DATABASE_URL="postgresql://postgres:@localhost:5432/muse3dstudio_test" npx prisma db push --force-reset

# Test data re-seed
DATABASE_URL="postgresql://postgres:@localhost:5432/muse3dstudio_test" npm run db:seed:products

# Test database check
sudo -u postgres psql muse3dstudio_test -c "SELECT COUNT(*) FROM products;"
```

### **Quick Test Commands:**
```bash
# Hızlı test setup
npm run test:server:setup

# Hızlı test restart
npm run test:server:restart

# Test vs Production karşılaştırma
curl -s http://16.171.140.155:3001/api/products | jq '.length'
curl -s http://16.171.140.155:3000/api/products | jq '.length'
```

## 🐛 Test Troubleshooting

### **Port Çakışması:**
```bash
# Port 3001 kullanımda mı?
sudo lsof -i:3001

# Çakışan process'i kapat
sudo kill -9 [PID]
```

### **Database Connection Error:**
```bash
# Test database var mı?
sudo -u postgres psql -c "\l" | grep muse3dstudio_test

# Connection test
psql postgresql://postgres:@localhost:5432/muse3dstudio_test -c "SELECT 1;"
```

### **Build Error:**
```bash
# Clean test environment
rm -rf node_modules .next
npm install
npm run build
```

## 🎉 Production'a Deploy

### **Test Başarılı ise:**
```bash
# Test branch'den main'e merge
git checkout main
git merge test
git push origin main

# Production güncelle
pm2 restart muse3dstudio

# Test environment temizle (opsiyonel)
pm2 delete muse3dstudio-test
```

---

## 📊 Test vs Production Karşılaştırma

| Aspect | Test (Port 3001) | Production (Port 3000) |
|--------|------------------|------------------------|
| Database | muse3dstudio_test | muse3dstudio |
| Memory Limit | 512MB | 1GB |
| Auto-restart | Yes | Yes |
| Environment | development | production |
| Logging | test logs | production logs |

**Test başarılı → Production'a güvenle deploy! 🚀** 