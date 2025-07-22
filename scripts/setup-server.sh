#!/bin/bash

# 🚀 HappyBee Auto Server Setup Script
# Bu script AWS EC2 sunucusunu otomatik olarak configure eder

set -e  # Exit on any error

echo "🚀 HappyBee Server Setup Starting..."
echo "=================================="

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install basic tools
echo "🛠️ Installing basic tools..."
apt install -y curl wget git htop unzip software-properties-common

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install PostgreSQL
echo "🗄️ Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Install Nginx
echo "🌐 Installing Nginx..."
apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Install PM2 globally
echo "🔄 Installing PM2..."
npm install -g pm2

# Create happybee user and database
echo "🗄️ Setting up PostgreSQL database..."
sudo -u postgres psql << 'EOF'
CREATE DATABASE happybee;
CREATE USER happybee_user WITH PASSWORD 'HappyBee2024!';
GRANT ALL PRIVILEGES ON DATABASE happybee TO happybee_user;
ALTER USER happybee_user CREATEDB;
\q
EOF

# Create log directories
echo "📝 Creating log directories..."
mkdir -p /var/www/happybee/logs
mkdir -p /var/log/pm2

# Set proper permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/happybee
chmod -R 755 /var/www/happybee

# Configure firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    echo "🔒 Configuring firewall..."
    ufw --force enable
    ufw allow ssh
    ufw allow 80
    ufw allow 443
    ufw allow 3000  # Temporary for testing
fi

# Create nginx config backup
echo "📋 Backing up default nginx config..."
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

echo ""
echo "✅ Server setup completed successfully!"
echo "=================================="
echo ""
echo "📋 Next steps:"
echo "1. Clone your repository to /var/www/happybee"
echo "2. Copy env.production.example to .env and configure"
echo "3. Run: npm install"
echo "4. Run: npm run db:setup-production"
echo "5. Run: npm run build"
echo "6. Run: pm2 start ecosystem.config.js"
echo "7. Configure Nginx reverse proxy"
echo ""
echo "🎯 Test URLs:"
echo "- Direct: http://$(curl -s ifconfig.me):3000"
echo "- Via Nginx: http://$(curl -s ifconfig.me)"
echo ""
echo "🔧 Installed versions:"
echo "- Node.js: $(node --version)"
echo "- NPM: $(npm --version)"
echo "- PostgreSQL: $(psql --version | head -n1)"
echo "- Nginx: $(nginx -v 2>&1)"
echo "- PM2: $(pm2 --version)"
echo "" 