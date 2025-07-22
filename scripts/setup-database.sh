#!/bin/bash

# 🗄️ Muse3DStudio Database Setup Script
# Bu script PostgreSQL database'ini configure eder ve seed data ekler

set -e  # Exit on any error

echo "🗄️ Muse3DStudio Database Setup Starting..."
echo "====================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📝 Please copy env.production.example to .env and configure it first."
    exit 1
fi

# Source environment variables
source .env

echo "📦 Installing ts-node for seeding..."
npm install --save-dev ts-node

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️ Pushing database schema..."
npx prisma db push

echo "🌱 Seeding database with initial data..."
echo "   → Creating admin user..."
npm run db:seed:user

echo "   → Creating product categories..."
echo "   → Creating sample products..."  
npm run db:seed:products

echo "✅ Database setup completed successfully!"
echo "====================================="
echo ""
echo "🎯 Database info:"
echo "- Database: muse3dstudio"
echo "- User: muse3dstudio_user"
echo "- Host: localhost:5432"
echo ""
echo "👤 Admin login credentials:"
echo "- Email: onuryasar@tes.com"
echo "- Password: 123"
echo ""
echo "🌐 You can now access:"
echo "- Admin Panel: http://your-server/admin"
echo "- Products API: http://your-server/api/products"
echo "" 