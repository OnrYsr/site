# 🚀 Muse3DStudio AWS EC2 Deploy Rehberi

Bu rehber Muse3DStudio e-ticaret projesini AWS EC2'ye deploy etmek için hazırlanmıştır.

## 📋 Sistem Gereksinimleri

### AWS EC2 Instance
- **Minimum**: t3.micro (1 vCPU, 1 GB RAM)
- **Önerilen**: t3.small (2 vCPU, 2 GB RAM)
- **OS**: Ubuntu 20.04+ / Amazon Linux 2

### Açılması Gereken Portlar (Security Group)
```
22    (SSH)  - Yönetim erişimi
80    (HTTP) - Web erişimi
443   (HTTPS)- SSL erişimi (opsiyonel)
3000  (HTTP) - Next.js direct erişimi (test için geçici)
5432  (PostgreSQL) - Database (sadece localhost)
```

## 🛠️ Otomatik Kurulum

### 1. Repo Clone ve Setup
```bash
# EC2'ye SSH bağlan
ssh -i your-key.pem ubuntu@your-ec2-ip

# Proje dizini oluştur
sudo mkdir -p /var/www/muse3dstudio
sudo chown $USER:$USER /var/www/muse3dstudio
cd /var/www/muse3dstudio

# Repo clone et
git clone https://github.com/your-username/site.git .

# Kurulum scriptini çalıştır
chmod +x scripts/setup-server.sh
sudo ./scripts/setup-server.sh
```

### 2. Environment Variables Ayarla
```bash
# .env dosyasını oluştur
cp env.production.example .env
nano .env

# Aşağıdaki değerleri güncelle:
# - DATABASE_URL (PostgreSQL connection string)
# - NEXTAUTH_URL (your server IP/domain)
# - NEXTAUTH_SECRET (strong random string)
```

### 3. Database Setup
```bash
# Database oluştur ve seed et
npm run db:setup-production
```

### 4. Build ve Start
```bash
# Production build
npm run build

# PM2 ile başlat
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🌐 Nginx Reverse Proxy Setup

Nginx konfigürasyonu `/etc/nginx/sites-available/muse3dstudio` dosyasında:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Domain veya IP

    # Muse3DStudio Ana Site
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Mevcut IoT Dashboard (eğer var ise)
    location /iot {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files cache
    location /static {
        alias /var/www/muse3dstudio/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Nginx'i enable et:
```bash
sudo ln -s /etc/nginx/sites-available/muse3dstudio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 📊 Monitoring ve Log'lar

### PM2 Monitoring
```bash
pm2 status          # Uygulama durumu
pm2 logs muse3dstudio   # Uygulama logları
pm2 monit          # Real-time monitoring
pm2 restart muse3dstudio # Uygulamayı restart et
```

### System Logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System resources
htop
df -h
free -h
```

### Database Backup
```bash
# PostgreSQL backup
pg_dump muse3dstudio > backup_$(date +%Y%m%d_%H%M%S).sql

# Otomatik backup script (crontab'a ekle)
0 2 * * * pg_dump muse3dstudio > /var/backups/muse3dstudio_$(date +\%Y\%m\%d).sql
```

## 🔄 Update/Deploy Workflow

### Kod güncellemesi için:
```bash
cd /var/www/muse3dstudio
git pull origin main
npm install
npm run build
pm2 restart muse3dstudio
```

### Database migration için:
```bash
npm run db:push
pm2 restart muse3dstudio
```

## 🔒 SSL Certificate (Let's Encrypt)

```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL certificate al
sudo certbot --nginx -d your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

## 🎯 Test URL'leri

Kurulum sonrası test URL'leri:

- **Ana Site**: http://your-ip/
- **Admin Panel**: http://your-ip/admin
- **API Health**: http://your-ip/api/products
- **Direct Next.js**: http://your-ip:3000

## ⚠️ Troubleshooting

### Common Issues:

1. **Port 3000 already in use**
   ```bash
   sudo lsof -ti:3000 | xargs sudo kill -9
   ```

2. **Permission denied for PostgreSQL**
   ```bash
   sudo -u postgres psql
ALTER USER muse3dstudio_user CREATEDB;
   ```

3. **Nginx 502 Bad Gateway**
   ```bash
   # Check if Next.js is running
   pm2 status
   # Check Nginx config
   sudo nginx -t
   ```

4. **Out of memory (t3.micro)**
   ```bash
   # Enable swap
   sudo fallocate -l 1G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

## 📞 Support

Sorun yaşarsanız:
1. PM2 loglarını kontrol edin: `pm2 logs`
2. Nginx loglarını kontrol edin: `sudo tail -f /var/log/nginx/error.log`
3. System resources: `htop`, `df -h`, `free -h`

---

**🎉 Başarılı deploy sonrası siteniz hazır!** 