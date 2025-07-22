# ⚡ HappyBee Quick Start Guide

Bu rehber HappyBee'yi 15 dakikada AWS EC2'ye deploy etmenizi sağlar.

## 🚀 1-Komut Deploy

### AWS EC2'ye SSH Bağlan
```bash
ssh -i your-key.pem ubuntu@56.228.30.48
```

### Auto Setup (5 dakika)
```bash
# 1. Server kurulumu (Node.js, PostgreSQL, Nginx, PM2)
sudo apt update
curl -sL https://raw.githubusercontent.com/your-username/site/main/scripts/setup-server.sh | sudo bash

# 2. Proje clone et
sudo mkdir -p /var/www/happybee
sudo chown $USER:$USER /var/www/happybee
cd /var/www/happybee
git clone https://github.com/your-username/site.git .

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
curl http://56.228.30.48
curl http://56.228.30.48/api/products
```

### Admin Paneli Test
```
URL: http://56.228.30.48/admin
Email: onuryasar@tes.com
Şifre: 123
```

## ⚡ Environment Variables

`.env` dosyasında mutlaka değiştirilmesi gerekenler:

```env
# PostgreSQL (otomatik oluşturuldu)
DATABASE_URL="postgresql://happybee_user:HappyBee2024!@localhost:5432/happybee"

# Server IP'ni yaz
NEXTAUTH_URL="http://56.228.30.48"

# Güçlü bir secret key oluştur
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```

## 🔄 Güncellemeler

### Kod güncellemesi:
```bash
cd /var/www/happybee
npm run deploy:update
```

### Yeni migration:
```bash
npm run db:push
pm2 restart happybee
```

## 🌐 URL'ler

Kurulum sonrası erişim:

- **Ana Site**: http://56.228.30.48/
- **Admin Panel**: http://56.228.30.48/admin  
- **API Docs**: http://56.228.30.48/api/products
- **IoT Dashboard**: http://56.228.30.48/iot (varsa)

## ⚠️ Troubleshooting

### Hızlı çözümler:

```bash
# PM2 restart
pm2 restart happybee

# Nginx restart  
sudo systemctl reload nginx

# Log kontrolü
pm2 logs happybee
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

✅ **HappyBee e-ticaret sitesi çalışıyor**  
✅ **Admin paneli erişilebilir**  
✅ **API endpoints aktif**  
✅ **Mevcut IoT sistemi korundu**  

**5 dakikada hazır! 🚀** 