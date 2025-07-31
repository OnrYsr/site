#!/bin/bash

# 🍓 Raspberry Pi Production Setup Script for Muse3DStudio
# Bu script Raspberry Pi'yi production için hazırlar

set -e

echo "🍓 Raspberry Pi Muse3DStudio Setup"
echo "=================================="

# Color definitions
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running on ARM64
if [[ $(uname -m) != "aarch64" ]]; then
    echo -e "${RED}❌ This script is designed for ARM64 architecture (Raspberry Pi 4/5)${NC}"
    exit 1
fi

echo -e "${GREEN}🔍 System Information:${NC}"
echo "Architecture: $(uname -m)"
echo "OS: $(lsb_release -d | cut -f2)"
echo "Memory: $(free -h | grep Mem | awk '{print $2}')"

# Update system
echo -e "${GREEN}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo -e "${GREEN}🛠️ Installing essential packages...${NC}"
sudo apt install -y curl wget git htop unzip software-properties-common build-essential

# Install Node.js 20 (ARM64 optimized)
echo -e "${GREEN}📦 Installing Node.js 20 for ARM64...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ NPM version: $(npm --version)${NC}"

# Install Docker (ARM64 optimized)
echo -e "${GREEN}🐳 Installing Docker for ARM64...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo -e "${GREEN}🐳 Installing Docker Compose...${NC}"
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Cloudflared
echo -e "${GREEN}☁️ Installing Cloudflared for ARM64...${NC}"
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared-linux-arm64.deb
rm cloudflared-linux-arm64.deb

# Create project directory
echo -e "${GREEN}📁 Setting up project directory...${NC}"
PROJECT_DIR="/home/$USER/muse3dstudio"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Clone project (if not exists)
if [ ! -d "web-app" ]; then
    echo -e "${GREEN}📥 Cloning project repository...${NC}"
    git clone https://github.com/OnrYsr/site.git web-app
fi

cd web-app

# Install dependencies
echo -e "${GREEN}📦 Installing project dependencies...${NC}"
npm install

# Setup environment
echo -e "${GREEN}⚙️ Setting up environment...${NC}"
if [ ! -f ".env" ]; then
    cp .env.rpi.production .env
    echo -e "${YELLOW}⚠️ Please edit .env file with your configuration${NC}"
fi

# Setup systemd services
echo -e "${GREEN}🔧 Setting up systemd services...${NC}"
sudo cp systemd/muse3d-web.service /etc/systemd/system/
sudo cp systemd/cloudflare-tunnel.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable muse3d-web.service
sudo systemctl enable cloudflare-tunnel.service

# Start Docker services
echo -e "${GREEN}🐳 Starting Docker services...${NC}"
sudo docker compose up -d postgres redis

# Generate Prisma client
echo -e "${GREEN}🗄️ Setting up database...${NC}"
npx prisma generate
npx prisma db push

# Start systemd services
echo -e "${GREEN}🚀 Starting application services...${NC}"
sudo systemctl start muse3d-web.service
sudo systemctl start cloudflare-tunnel.service

# Wait for services
echo -e "${GREEN}⏳ Waiting for services to start...${NC}"
sleep 10

# Check status
echo -e "${GREEN}📊 Service Status:${NC}"
sudo systemctl is-active muse3d-web.service && echo "✅ Web service: Active" || echo "❌ Web service: Failed"
sudo systemctl is-active cloudflare-tunnel.service && echo "✅ Tunnel service: Active" || echo "❌ Tunnel service: Failed"

# Health check
echo -e "${GREEN}🏥 Health Check:${NC}"
curl -f http://localhost:3000/api/health > /dev/null 2>&1 && echo "✅ Application: Healthy" || echo "❌ Application: Not responding"

echo -e "${GREEN}🎉 Raspberry Pi setup completed!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Edit .env file with your configuration"
echo "2. Configure Cloudflare tunnel token"
echo "3. Test the application at http://$(hostname -I | awk '{print $1}'):3000"
echo "4. Set up your domain DNS"
echo ""
echo -e "${GREEN}✨ Happy coding!${NC}" 