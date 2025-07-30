# 🚀 Muse3DStudio - Production Deployment Guide

**Full-stack Next.js e-commerce platform with Docker deployment**

## 🏗️ Architecture Overview

- **Frontend**: Next.js 15 with App Router
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Deployment**: Docker Compose
- **Proxy**: Nginx
- **Process Management**: Docker containers with auto-restart

---

## 📋 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 10GB free space
- **CPU**: 2+ cores recommended

### Required Software
- Docker & Docker Compose
- Git
- Make (optional, for convenience)

---

## 🚀 Quick Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Make (optional)
sudo apt install -y make

# Logout and login again to apply docker group
logout
```

### 2. Project Setup

```bash
# Create project directory
sudo mkdir -p /var/www/muse3dstudio
sudo chown $USER:$USER /var/www/muse3dstudio
cd /var/www/muse3dstudio

# Clone project (or upload files)
git clone <your-repository-url> .
# OR upload files via scp/rsync

# Copy environment file
cp env.production.example .env
```

### 3. Environment Configuration

Edit the `.env` file:

```bash
nano .env
```

Required environment variables:
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/muse3dstudio
REDIS_URL=redis://redis:6379
NEXTAUTH_URL=http://your-server-ip:3000
NEXTAUTH_SECRET=your-super-secret-key-here
```

### 4. Start Production Environment

```bash
# Using Make (recommended)
make prod-build

# Or using Docker Compose directly
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### 5. Database Setup

```bash
# Wait for services to start (30 seconds)
sleep 30

# Setup database
make prod-db-setup

# Or manually
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec app npm run db:push
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec app npm run db:seed
```

### 6. Create Admin User

```bash
# Create admin user
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec app npm run create:admin
```

---

## 🔧 Management Commands

### Using Make Commands

```bash
# View all available commands
make help

# Production deployment
make prod-build                 # Build and start production
make prod-down                  # Stop production services
make prod-db-setup             # Setup production database

# Monitoring
make status                    # Check service status
make logs                      # View app logs
make health                    # Check application health

# Remote server management (set SERVER_IP and SERVER_USER env vars)
export SERVER_IP=your-server-ip
export SERVER_USER=ubuntu

make server-status             # Check remote server status
make server-logs               # View remote server logs
make server-restart            # Restart remote services
make deploy-quick              # Quick deployment (code only)
make deploy-server             # Full deployment
```

### Using Docker Compose Directly

```bash
# Start production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Stop services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f app

# Check status
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Restart services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart
```

---

## 🌐 Access Your Application

After successful deployment:

- **Website**: `http://your-server-ip`
- **Admin Panel**: `http://your-server-ip/admin`
- **API Health Check**: `http://your-server-ip/api/health`

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Services Not Starting
```bash
# Check container logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs

# Check specific service
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs app
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs nginx
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs postgres
```

#### 2. Database Connection Issues
```bash
# Check database status
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec postgres pg_isready -U postgres

# Reset database
make db-reset
```

#### 3. Application Not Accessible
```bash
# Check nginx status
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -t

# Check if ports are open
netstat -tlnp | grep :80
netstat -tlnp | grep :3000

# Check firewall
sudo ufw status
```

#### 4. Port Already in Use
```bash
# Stop conflicting services
sudo systemctl stop nginx apache2

# Or change ports in docker-compose.prod.yml
```

### Health Checks

```bash
# Application health
curl http://localhost/api/health

# Database health
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec postgres pg_isready

# Service status
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

---

## 🔄 Updates & Maintenance

### Quick Code Updates

```bash
# On your local machine
export SERVER_IP=your-server-ip
export SERVER_USER=ubuntu
make deploy-quick
```

### Full Deployment

```bash
# On your local machine
export SERVER_IP=your-server-ip
export SERVER_USER=ubuntu
make deploy-server
```

### Manual Update Process

```bash
# On server
cd /var/www/muse3dstudio

# Pull latest code
git pull

# Restart services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart app

# Or rebuild if needed
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build app
```

---

## 📊 Monitoring

### Container Status
```bash
make status
# or
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

### Application Logs
```bash
make logs
# or
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f app
```

### Resource Usage
```bash
docker stats
```

### Health Status
```bash
make health
# or
curl http://your-server-ip/api/health
```

---

## 🔒 Security Considerations

1. **Change default passwords** in environment variables
2. **Use strong NEXTAUTH_SECRET** (generate with `openssl rand -base64 32`)
3. **Set up SSL certificates** for HTTPS (Let's Encrypt recommended)
4. **Configure firewall** to allow only necessary ports
5. **Regular backups** of database
6. **Keep system updated** with security patches

---

## 🎉 Success!

Your Muse3DStudio e-commerce platform is now running in production! 

For additional help, check the logs or open an issue in the project repository. 