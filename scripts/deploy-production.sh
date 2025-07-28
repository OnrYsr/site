#!/bin/bash

# 🚀 Muse3DStudio Production Deployment Script
# Bu script projeyi production sunucusuna deploy eder

set -e

echo "🚀 Muse3DStudio Production Deployment"
echo "====================================="

# Color definitions
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
SERVER_IP=""
SERVER_USER="ubuntu"
SSH_KEY=""
DOMAIN=""
PROJECT_DIR="/var/www/muse3dstudio"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --server)
            SERVER_IP="$2"
            shift 2
            ;;
        --user)
            SERVER_USER="$2"
            shift 2
            ;;
        --key)
            SSH_KEY="$2"
            shift 2
            ;;
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        *)
            echo "Unknown option $1"
            exit 1
            ;;
    esac
done

# Interactive setup if no arguments provided
if [ -z "$SERVER_IP" ]; then
    echo -e "${YELLOW}Enter server details:${NC}"
    read -p "Server IP: " SERVER_IP
    read -p "Server user [ubuntu]: " INPUT_USER
    SERVER_USER="${INPUT_USER:-ubuntu}"
    read -p "SSH key path (optional): " SSH_KEY
    read -p "Domain (optional): " DOMAIN
fi

if [ -z "$SERVER_IP" ]; then
    echo -e "${RED}❌ Server IP is required!${NC}"
    exit 1
fi

# Build SSH command
SSH_CMD="ssh"
if [ -n "$SSH_KEY" ]; then
    SSH_CMD="ssh -i $SSH_KEY"
fi
SSH_CONN="$SSH_CMD $SERVER_USER@$SERVER_IP"

echo -e "${BLUE}📡 Deployment Details:${NC}"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Project Dir: $PROJECT_DIR"
echo "Domain: ${DOMAIN:-'Not set'}"
echo ""

read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo -e "${GREEN}🧹 Step 1: Cleaning old installation...${NC}"
$SSH_CONN << 'EOF'
# Stop any running services
sudo systemctl stop nginx 2>/dev/null || true
sudo pkill -f "node\|npm\|pm2" 2>/dev/null || true
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# Clean up old files
sudo rm -rf /var/www/* 2>/dev/null || true
sudo rm -rf /tmp/muse3d* 2>/dev/null || true

echo "✅ Server cleaned"
EOF

echo -e "${GREEN}🐳 Step 2: Installing Docker and dependencies...${NC}"
$SSH_CONN << 'EOF'
# Update system
sudo apt update
sudo apt install -y curl git make

# Install Docker if not exists
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# Install Docker Compose if not exists
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo "✅ Docker installed"
EOF

echo -e "${GREEN}📦 Step 3: Cloning project...${NC}"
$SSH_CONN << EOF
# Create project directory
sudo mkdir -p $PROJECT_DIR
sudo chown $SERVER_USER:$SERVER_USER $PROJECT_DIR
cd $PROJECT_DIR

# Clone project (assuming it's in a git repo)
# You'll need to replace this with your actual git repository
echo "⚠️  Manual step needed: Upload project files"
echo "Please run: scp -r . $SERVER_USER@$SERVER_IP:$PROJECT_DIR/"
EOF

echo -e "${YELLOW}📂 Step 4: Upload project files${NC}"
echo "Run this command from your local machine:"
echo ""
if [ -n "$SSH_KEY" ]; then
    echo -e "${BLUE}scp -i $SSH_KEY -r . $SERVER_USER@$SERVER_IP:$PROJECT_DIR/${NC}"
else
    echo -e "${BLUE}scp -r . $SERVER_USER@$SERVER_IP:$PROJECT_DIR/${NC}"
fi
echo ""
read -p "Press Enter after uploading files..."

echo -e "${GREEN}🔧 Step 5: Setting up production environment...${NC}"
$SSH_CONN << EOF
cd $PROJECT_DIR

# Copy production environment
cp env.production.example .env
echo "DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/muse3dstudio" >> .env
echo "NEXTAUTH_URL=http://$SERVER_IP:3000" >> .env
echo "NEXTAUTH_SECRET=\$(openssl rand -base64 32)" >> .env

# Set proper permissions
chmod +x scripts/*.sh

echo "✅ Environment configured"
EOF

echo -e "${GREEN}🐳 Step 6: Starting Docker services...${NC}"
$SSH_CONN << EOF
cd $PROJECT_DIR

# Start production services
make prod-build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Setup database
make db-setup

echo "✅ Services started"
EOF

echo -e "${GREEN}🌐 Step 7: Configuring Nginx (optional)...${NC}"
if [ -n "$DOMAIN" ]; then
    $SSH_CONN << EOF
cd $PROJECT_DIR

# Run nginx setup script
sudo ./scripts/setup-nginx.sh $DOMAIN

echo "✅ Nginx configured for $DOMAIN"
EOF
else
    echo "Skipping Nginx setup (no domain provided)"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo "====================================="
echo ""
echo -e "${GREEN}🌐 Access your application:${NC}"
if [ -n "$DOMAIN" ]; then
    echo "- Website: https://$DOMAIN"
    echo "- Admin Panel: https://$DOMAIN/admin"
else
    echo "- Website: http://$SERVER_IP:3000"
    echo "- Admin Panel: http://$SERVER_IP:3000/admin"
fi
echo "- Health Check: http://$SERVER_IP:3000/api/health"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Create admin user: ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && make db-create-admin'"
echo "2. Test the application"
echo "3. Configure domain DNS if not done"
echo ""
echo -e "${GREEN}🎉 Deployment successful!${NC}" 