#!/bin/bash

# 🌐 Muse3DStudio Nginx Setup Script
# Bu script Nginx reverse proxy'i configure eder

set -e  # Exit on any error

echo "🌐 Muse3DStudio Nginx Setup Starting..."
echo "=================================="

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

# Ask for domain or use IP
echo "🌍 Domain or IP configuration:"
echo "1. Use IP address ($SERVER_IP)"
echo "2. Use custom domain"
read -p "Select option (1 or 2): " choice

if [ "$choice" = "2" ]; then
    read -p "Enter your domain (e.g., shop.example.com): " DOMAIN
    SERVER_NAME=$DOMAIN
else
    SERVER_NAME=$SERVER_IP
fi

# Check if IoT dashboard exists (port 5000)
IOT_RUNNING=false
if nc -z localhost 5000 2>/dev/null; then
    IOT_RUNNING=true
    echo "🤖 IoT Dashboard detected on port 5000"
fi

# Create nginx config
echo "📝 Creating Nginx configuration..."

cat > /etc/nginx/sites-available/muse3dstudio << EOL
server {
    listen 80;
    server_name $SERVER_NAME;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Muse3DStudio Next.js Application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

EOL

# Add IoT dashboard config if it exists
if [ "$IOT_RUNNING" = true ]; then
    cat >> /etc/nginx/sites-available/happybee << EOL
    # IoT Dashboard (Existing)
    location /iot {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

EOL
fi

# Add static files and closing brace
cat >> /etc/nginx/sites-available/happybee << EOL
    # Static files optimization
    location /_next/static {
        alias /var/www/muse3dstudio/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Public assets
    location /images {
        alias /var/www/muse3dstudio/public/images;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
EOL

# Enable site
echo "🔗 Enabling site..."
ln -sf /etc/nginx/sites-available/muse3dstudio /etc/nginx/sites-enabled/

# Remove default site if exists
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    echo "🗑️ Removing default site..."
    rm /etc/nginx/sites-enabled/default
fi

# Test nginx config
echo "🧪 Testing Nginx configuration..."
nginx -t

# Reload nginx
echo "🔄 Reloading Nginx..."
systemctl reload nginx

echo ""
echo "✅ Nginx setup completed successfully!"
echo "=================================="
echo ""
echo "🌐 Your site is now available at:"
echo "   → http://$SERVER_NAME"
echo ""
if [ "$IOT_RUNNING" = true ]; then
    echo "🤖 IoT Dashboard available at:"
    echo "   → http://$SERVER_NAME/iot"
    echo ""
fi
echo "🔧 Direct Next.js access (for testing):"
echo "   → http://$SERVER_NAME:3000"
echo ""
echo "📝 Nginx configuration file:"
echo "   → /etc/nginx/sites-available/muse3dstudio"
echo ""
echo "🔄 To restart Nginx:"
echo "   → sudo systemctl reload nginx"
echo "" 