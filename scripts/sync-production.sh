#!/bin/bash

# 🔄 Production Sync Script
# Bu script production database'ini local'e senkronize eder

set -e

echo "🔄 Muse3DStudio Production Sync"
echo "====================================="

# Color definitions
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running in Docker environment
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ docker-compose.yml not found!${NC}"
    exit 1
fi

# Load environment variables
if [ -f ".env.local" ]; then
    source .env.local
elif [ -f ".env" ]; then
    source .env
else
    echo -e "${RED}❌ Environment file not found!${NC}"
    exit 1
fi

# Get production database URL
if [ -z "$PRODUCTION_DATABASE_URL" ] && [ -z "$DATABASE_URL_PROD" ]; then
    echo -e "${YELLOW}Production database URL not found in environment${NC}"
    read -p "Enter production database URL: " PROD_URL
    
    if [ -z "$PROD_URL" ]; then
        echo -e "${RED}❌ Production database URL is required!${NC}"
        exit 1
    fi
else
    PROD_URL="${PRODUCTION_DATABASE_URL:-$DATABASE_URL_PROD}"
fi

echo -e "${YELLOW}⚠️  This will replace your local database with production data${NC}"
echo -e "${YELLOW}⚠️  Current local data will be lost!${NC}"
read -p "Are you sure? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Sync cancelled."
    exit 1
fi

# Create backup directory
mkdir -p backups

# Backup current local database
echo -e "${GREEN}📦 Creating backup of current local database...${NC}"
BACKUP_FILE="backups/local_backup_$(date +%Y%m%d_%H%M%S).sql"
docker-compose exec postgres pg_dump -U postgres muse3dstudio > "$BACKUP_FILE"
echo -e "${GREEN}✅ Local backup saved: $BACKUP_FILE${NC}"

# Create temporary dump file
TEMP_DUMP="/tmp/prod_sync_$(date +%Y%m%d_%H%M%S).sql"

echo -e "${GREEN}🌐 Downloading production database...${NC}"
# Use pg_dump to get production data
if command -v pg_dump > /dev/null; then
    # Direct connection
    pg_dump "$PROD_URL" --no-owner --no-acl --clean --if-exists > "$TEMP_DUMP"
else
    # Use Docker PostgreSQL client
    docker run --rm postgres:16-alpine pg_dump "$PROD_URL" --no-owner --no-acl --clean --if-exists > "$TEMP_DUMP"
fi

echo -e "${GREEN}📥 Restoring production data to local database...${NC}"
# Restore to local database
docker-compose exec -T postgres psql -U postgres -d muse3dstudio < "$TEMP_DUMP"

# Cleanup
rm "$TEMP_DUMP"

# Run Prisma generate to ensure client is up to date
echo -e "${GREEN}🔧 Updating Prisma client...${NC}"
docker-compose exec app npm run db:generate

echo -e "${GREEN}✅ Production sync completed successfully!${NC}"
echo "====================================="
echo -e "${YELLOW}Local database now contains production data${NC}"
echo -e "${YELLOW}Backup of previous local data: $BACKUP_FILE${NC}"
echo ""
echo -e "${GREEN}🌐 You can now access:${NC}"
echo "- App: http://localhost:3000"
echo "- Admin Panel: http://localhost:3000/admin"
echo "- Prisma Studio: http://localhost:5555" 