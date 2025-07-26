# 🚀 Muse3DStudio Development Workflow

Modern Docker-based development environment with automated setup and deployment pipeline.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Dev     │    │   Production    │    │   Production    │
│   (Docker)      │───▶│   (Docker)      │───▶│   (AWS EC2)     │
│                 │    │                 │    │                 │
│ • PostgreSQL    │    │ • PostgreSQL    │    │ • PostgreSQL    │
│ • Redis         │    │ • Redis         │    │ • Redis         │
│ • Next.js App   │    │ • Next.js App   │    │ • Next.js App   │
│ • Prisma Studio │    │ • Nginx         │    │ • Nginx         │
│ • pgAdmin       │    │                 │    │ • PM2           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ⚡ Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- Make (optional, for convenience commands)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd muse3dstudio

# Automated setup (with Make)
make setup

# Or manual setup
cp env.development.example .env.local
npm install
npm run docker:dev
```

### 2. Access Services
- **App**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Prisma Studio**: http://localhost:5555
- **pgAdmin**: http://localhost:5050
- **Health Check**: http://localhost:3000/api/health

## 🛠️ Development Commands

### With Make (Recommended)
```bash
make help           # Show all available commands
make dev            # Start development environment
make logs           # View application logs
make studio         # Open Prisma Studio
make db-reset       # Reset database
make clean          # Clean everything
make restart        # Restart all services
```

### With NPM Scripts
```bash
npm run docker:dev          # Start development
npm run docker:down         # Stop services
npm run docker:logs         # View logs
npm run docker:clean        # Clean up
npm run docker:db:reset     # Reset database
```

### With Docker Compose
```bash
docker-compose up -d        # Start services
docker-compose down         # Stop services
docker-compose logs -f app  # View logs
```

## 📁 Project Structure

```
muse3dstudio/
├── .cursorrules              # Cursor AI development rules
├── docker-compose.yml        # Development services
├── docker-compose.prod.yml   # Production overrides
├── Dockerfile               # Multi-stage container build
├── Makefile                 # Development automation
├── env.development.example  # Environment template
├── env.production.example   # Production environment
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # Backend API routes
│   │   ├── admin/          # Admin panel
│   │   └── (public)/       # Public pages
│   ├── components/         # React components
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed-*.ts         # Database seeders
│   └── migrations/       # Database migrations
└── scripts/              # Deployment scripts
```

## 🔄 Development Workflow

### Daily Development
```bash
# Start development
make dev

# View logs while developing
make logs

# Reset database when needed
make db-reset

# Stop services when done
make down
```

### Code Quality
- **Cursor Rules**: Follow `.cursorrules` for consistent coding
- **TypeScript**: Strict typing enforced
- **ESLint**: Code linting and formatting
- **Prisma**: Type-safe database operations

### Database Management
```bash
# View database with Prisma Studio
make studio

# View database with pgAdmin
make pgadmin

# Reset and reseed database
make db-reset

# Run migrations
npm run db:push

# Seed data
npm run db:seed
```

## 🚀 Deployment Pipeline

### 1. Local to Production Pipeline
```bash
# 1. Develop locally with Docker
make dev

# 2. Test production build locally
make prod-build

# 3. Commit and push changes
git add .
git commit -m "feat: new feature"
git push origin main

# 4. Deploy to production (on server)
cd /var/www/muse3dstudio
git pull origin main
npm run build
pm2 restart muse3dstudio
```

### 2. Production Environment Setup
```bash
# On production server
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Or using traditional PM2 deployment
npm run build
pm2 start ecosystem.config.js
```

## 🔧 Environment Management

### Development (.env.local)
```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/muse3dstudio"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret"
NODE_ENV="development"
```

### Production (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/muse3dstudio"
NEXTAUTH_URL="https://muse3dstudio.com"
NEXTAUTH_SECRET="super-secure-production-secret"
NODE_ENV="production"
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
make clean    # Clean all containers
make dev      # Restart development
```

#### Database Connection Issues
```bash
make db-reset    # Reset database completely
```

#### Build Issues
```bash
make clean       # Clean everything
make dev-build   # Rebuild from scratch
```

#### Permission Issues (Linux/Mac)
```bash
sudo chown -R $USER:$USER .
```

### Health Checks
```bash
# Check application health
make health

# Check service status
make status

# View all logs
make logs-all
```

## 📊 Monitoring & Logging

### Development Monitoring
- **Application Logs**: `make logs`
- **Database GUI**: `make studio` or `make pgadmin`
- **Health Status**: http://localhost:3000/api/health

### Production Monitoring
- **PM2 Monitoring**: `pm2 monit`
- **Application Health**: `/api/health` endpoint
- **Nginx Logs**: `/var/log/nginx/`

## 🔐 Security Best Practices

### Development
- Never commit `.env` files
- Use strong secrets even in development
- Regularly update dependencies

### Production
- Use environment variables for all secrets
- Enable HTTPS with Let's Encrypt
- Regular security updates
- Database backups
- Monitor logs for suspicious activity

## 🚀 Performance Optimization

### Development
- Hot reload with Turbopack
- Docker layer caching
- Volume mounts for fast file changes

### Production
- Multi-stage Docker builds
- Nginx reverse proxy
- PostgreSQL optimizations
- Redis caching
- CDN for static assets

## 📚 Additional Resources

- **Cursor Rules**: `.cursorrules` - AI coding standards
- **API Documentation**: http://localhost:3000/api/health
- **Database Schema**: `prisma/schema.prisma`
- **Deployment Guide**: `DEPLOY.md`

## 🎯 Next Steps

1. **Testing Setup**: Add Jest, Cypress for E2E testing
2. **CI/CD Pipeline**: GitHub Actions for automated deployment
3. **Monitoring**: Add Sentry, DataDog for production monitoring
4. **Caching**: Implement Redis caching strategies
5. **CDN**: Setup CloudFront for static assets

## 💡 Tips & Tricks

- Use `make info` to see all available URLs
- Keep Docker containers running for faster development
- Use `make restart` for quick environment refresh
- Check `.cursorrules` for coding standards
- Use health checks to verify deployments 