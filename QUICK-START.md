# ⚡ Muse3DStudio Quick Start Guide

**✅ PRODUCTION DEPLOYMENT BAŞARILI!**

## 🌐 **Live Site**: [https://muse3dstudio.com](https://muse3dstudio.com)

Bu rehber Muse3DStudio'yu 15 dakikada AWS EC2'ye deploy etmenizi sağlar.

## 🚀 1-Komut Deploy

### AWS EC2'ye SSH Bağlan
```bash
ssh -i your-key.pem ubuntu@16.171.34.240
# Production Instance: i-03e2a3280eb227ff5
```

### Auto Setup (5 dakika)
```bash
# 1. Server kurulumu (Node.js, PostgreSQL, Nginx, PM2)
sudo apt update
curl -sL https://raw.githubusercontent.com/OnrYsr/site/main/scripts/setup-server.sh | sudo bash

# 2. Proje clone et
sudo mkdir -p /var/www/muse3dstudio
sudo chown $USER:$USER /var/www/muse3dstudio
cd /var/www/muse3dstudio
git clone https://github.com/OnrYsr/site.git .

# 3. Environment ayarla
cp env.production.example .env
nano .env  # DATABASE_URL ve NEXTAUTH_URL'yi düzenle

# 4. Dependencies ve build
npm install
npm run db:setup-production
npm run build

# 5. PM2 ile başlat
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 6. Nginx configure et
sudo ./scripts/setup-nginx.sh
```

## 🎯 Test Et

### Çalışıyor mu?
```bash
# PM2 durumu
pm2 status

# Site erişimi
curl http://16.171.34.240
curl http://16.171.34.240/api/products
```

### Admin Paneli Test
```
URL: http://16.171.34.240/admin
NOT: İlk admin kullanıcısını kayıt ol sayfasından oluşturun
Sonra veritabanında role ADMIN yapın
```

## ⚡ Environment Variables

`.env` dosyasında mutlaka değiştirilmesi gerekenler:

```env
# PostgreSQL (otomatik oluşturuldu)
DATABASE_URL="postgresql://muse3dstudio_user:Muse3DStudio2024!@localhost:5432/muse3dstudio"

# Server IP'ni yaz
NEXTAUTH_URL="http://16.171.34.240"

# Güçlü bir secret key oluştur
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```

## 🔄 Güncellemeler

### Kod güncellemesi:
```bash
cd /var/www/muse3dstudio
npm run deploy:update
```

### Yeni migration:
```bash
npm run db:push
pm2 restart muse3dstudio
```

## 🌐 URL'ler

Kurulum sonrası erişim:

- **Ana Site**: http://16.171.34.240/
- **Admin Panel**: http://16.171.34.240/admin  
- **API Docs**: http://16.171.34.240/api/products
- **IoT Dashboard**: http://16.171.34.240/iot (varsa)

## ⚠️ Troubleshooting

### Hızlı çözümler:

```bash
# PM2 restart
pm2 restart muse3dstudio

# Nginx restart  
sudo systemctl reload nginx

# Log kontrolü
pm2 logs muse3dstudio
sudo tail -f /var/log/nginx/error.log

# Port kontrolü
sudo lsof -ti:3000
sudo lsof -ti:80
```

### Memory yetersizse (t3.micro):
```bash
# Swap enable et
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile  
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 🔒 Security (Production için)

### SSL Certificate:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Firewall:
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
```

---

## 🎉 Deploy Tamamlandı!

✅ **Muse3DStudio e-ticaret sitesi çalışıyor**  
✅ **Admin paneli erişilebilir**  
✅ **API endpoints aktif**  
✅ **Mevcut IoT sistemi korundu**  

**5 dakikada hazır! 🚀** 