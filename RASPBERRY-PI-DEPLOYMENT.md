# 🍓 Raspberry Pi Deployment Guide

Complete guide for deploying Muse3DStudio on Raspberry Pi with automated CI/CD.

## 🎯 **Overview**

This setup provides:
- ✅ **Production-ready** Raspberry Pi deployment
- ✅ **Automated CI/CD** via GitHub Actions
- ✅ **Hybrid architecture** (Docker + Native services)
- ✅ **Cloudflare Tunnel** for secure global access
- ✅ **Systemd services** for auto-startup
- ✅ **Health monitoring** and automatic restarts

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────┐
│             Raspberry Pi 4/5           │
├─────────────────────────────────────────┤
│  🐳 Docker Services:                   │
│  ├── PostgreSQL 16 (port 5432)         │
│  └── Redis 7 (port 6379)               │
│                                         │
│  🔧 Native Services:                   │
│  ├── Next.js App (systemd service)     │
│  └── Cloudflare Tunnel (systemd)       │
│                                         │
│  🌐 Access:                            │
│  ├── Local: http://192.168.1.x:3000    │
│  └── Global: https://muse3dstudio.com   │
└─────────────────────────────────────────┘
```

## 🔧 **Prerequisites**

### Hardware Requirements
- **Raspberry Pi 4/5** (4GB+ RAM recommended)
- **32GB+ SD Card** (Class 10 or better)
- **Ethernet connection** (for best performance)
- **Optional:** External storage for backups

### Software Requirements
- **Ubuntu 22.04 LTS ARM64** (recommended)
- **Docker & Docker Compose**
- **Node.js 20+**
- **Git**

## 🚀 **Quick Setup**

### 1. **Fresh Pi Setup** (One-time)
```bash
# Run the automated setup script
curl -fsSL https://raw.githubusercontent.com/OnrYsr/site/main/scripts/setup-rpi.sh | bash
```

### 2. **Configure GitHub Secrets** (One-time)
Add these secrets in GitHub repository → Settings → Secrets and variables → Actions:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `SSH_PRIVATE_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | SSH private key for Pi access |
| `SERVER_HOST` | `192.168.1.8` | Pi IP address |
| `SERVER_USER` | `muse3dstudio` | SSH username |
| `SERVER_PATH` | `/home/muse3dstudio/muse3dstudio/web-app` | Project path |

### 3. **Environment Configuration** (One-time)
```bash
# On Raspberry Pi
cd ~/muse3dstudio/web-app
cp .env.rpi.production .env

# Edit with your values
nano .env
```

### 4. **Deploy** (Automated)
```bash
# Push to main branch triggers automatic deployment
git push origin main
```

## ⚙️ **Manual Setup Steps**

### 1. **Pi System Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared-linux-arm64.deb
```

### 2. **Project Setup**
```bash
# Clone repository
mkdir -p ~/muse3dstudio
cd ~/muse3dstudio
git clone https://github.com/OnrYsr/site.git web-app
cd web-app

# Install dependencies
npm install

# Setup environment
cp .env.rpi.production .env
# Edit .env with your configuration
```

### 3. **Database Setup**
```bash
# Start Docker services
sudo docker compose up -d postgres redis

# Setup database schema
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. **Systemd Services**
```bash
# Install systemd services
sudo cp systemd/muse3d-web.service /etc/systemd/system/
sudo cp systemd/cloudflare-tunnel.service /etc/systemd/system/
sudo systemctl daemon-reload

# Enable auto-start
sudo systemctl enable muse3d-web.service
sudo systemctl enable cloudflare-tunnel.service

# Start services
sudo systemctl start muse3d-web.service
sudo systemctl start cloudflare-tunnel.service
```

## 🔐 **Environment Variables**

### Required Variables
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/muse3dstudio
REDIS_URL=redis://localhost:6379

# Application
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=https://muse3dstudio.com
NEXTAUTH_SECRET=your-super-secret-key-here

# Cloudflare
CLOUDFLARE_TUNNEL_TOKEN=your-tunnel-token-here
```

### Performance Optimization
```bash
# Raspberry Pi specific optimizations
NODE_OPTIONS=--max-old-space-size=512
```

## 🔄 **CI/CD Pipeline**

### GitHub Actions Workflow
The deployment is fully automated via GitHub Actions:

1. **Trigger:** Push to `main` branch
2. **SSH:** Connect to Pi via SSH key
3. **Update:** Pull latest code changes
4. **Dependencies:** Install/update npm packages
5. **Services:** Update systemd services
6. **Database:** Ensure Docker services running
7. **Restart:** Restart application services
8. **Verify:** Health check and status verification

### Manual Deployment
```bash
# On local machine
git push origin main

# Or trigger manually in GitHub Actions
```

## 📊 **Monitoring & Maintenance**

### Service Status
```bash
# Check all services
sudo systemctl status muse3d-web.service
sudo systemctl status cloudflare-tunnel.service
sudo docker compose ps

# Check application health
curl http://localhost:3000/api/health
```

### Logs
```bash
# Application logs
sudo journalctl -u muse3d-web.service -f

# Tunnel logs
sudo journalctl -u cloudflare-tunnel.service -f

# Docker logs
sudo docker compose logs postgres redis
```

### Performance Monitoring
```bash
# System resources
htop
free -h
df -h

# Pi-specific monitoring
vcgencmd measure_temp  # CPU temperature
vcgencmd get_throttled # Throttling status
```

## 🔧 **Troubleshooting**

### Common Issues

#### 1. Service Won't Start
```bash
# Check service status
sudo systemctl status muse3d-web.service

# Check logs
sudo journalctl -u muse3d-web.service -f

# Restart service
sudo systemctl restart muse3d-web.service
```

#### 2. Database Connection Issues
```bash
# Check Docker services
sudo docker compose ps

# Restart database
sudo docker compose restart postgres redis

# Check connectivity
sudo docker compose exec postgres pg_isready
```

#### 3. Memory Issues
```bash
# Check memory usage
free -h

# Restart services to free memory
sudo systemctl restart muse3d-web.service

# Check swap
sudo swapon --show
```

#### 4. SSH Deployment Fails
```bash
# Verify SSH key in GitHub Secrets
# Check Pi SSH access:
ssh muse3dstudio@192.168.1.8

# Check GitHub Actions logs for specific error
```

### Recovery Commands
```bash
# Complete service restart
sudo systemctl restart muse3d-web.service cloudflare-tunnel.service

# Docker services restart
sudo docker compose restart

# Full system reboot (if needed)
sudo reboot
```

## 🚀 **Performance Optimization**

### Raspberry Pi 4/5 Optimizations
```bash
# /boot/config.txt optimizations
gpu_mem=64
dtoverlay=pi3-disable-wifi  # If using Ethernet only
arm_freq=2000  # Overclock (ensure proper cooling)

# Swap configuration
sudo swapon --show
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Application Optimizations
- **Node.js memory limit:** 512MB max
- **Database connections:** Limited to 50
- **Redis memory:** 128MB max
- **Build optimization:** Production builds only

## 🔄 **Backup & Recovery**

### Automated Backups
```bash
# Database backup (daily at 2 AM)
sudo docker compose --profile backup up -d backup
```

### Manual Backup
```bash
# Database backup
sudo docker compose exec postgres pg_dump -U postgres muse3dstudio > backup.sql

# Full project backup
cp -r ~/muse3dstudio ~/muse3dstudio-backup-$(date +%Y%m%d)
```

## 📝 **Development Workflow**

### Local Development → Pi Production
```bash
# 1. Develop locally
npm run dev

# 2. Test locally with production data
make sync-from-prod

# 3. Commit and push
git add .
git commit -m "feature: new functionality"
git push origin main

# 4. Automatic deployment to Pi via GitHub Actions
# 5. Verify deployment at https://muse3dstudio.com
```

## 🌐 **Network Configuration**

### Local Network Access
- **Ethernet IP:** `192.168.1.6` (preferred - 239 Mbps)
- **WiFi IP:** `192.168.1.8` (backup - 62 Mbps)
- **Local URL:** `http://192.168.1.6:3000`

### Global Access via Cloudflare
- **Domain:** `https://muse3dstudio.com`
- **Tunnel ID:** `9d9f6e21-97f0-4a0f-9f1d-571b515f7bc4`
- **Admin Panel:** `https://muse3dstudio.com/auth/login`

## 📞 **Support**

### Documentation
- **Main README:** `README.md`
- **Development:** `DEV-WORKFLOW.md`  
- **Deployment:** `DEPLOY.md`
- **Quick Start:** `QUICK-START.md`

### Logs Location
- **Application:** `sudo journalctl -u muse3d-web.service`
- **Tunnel:** `sudo journalctl -u cloudflare-tunnel.service`
- **Docker:** `sudo docker compose logs`

---

**🎉 Happy deploying on Raspberry Pi!** 🍓

*Last updated: January 31, 2025* 