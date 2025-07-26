# Muse3DStudio Development Makefile

.DEFAULT_GOAL := help
.PHONY: help setup dev down clean logs db-reset build prod deploy

# Colors for output
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

## Help
help: ## Show this help message
	@echo "$(GREEN)Muse3DStudio Development Commands$(RESET)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  $(YELLOW)%-15s$(RESET) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

## Development
setup: ## Initial project setup
	@echo "$(GREEN)Setting up Muse3DStudio development environment...$(RESET)"
	@cp env.development.example .env.local
	@echo "$(YELLOW)✓ Environment file created (.env.local)$(RESET)"
	@npm install
	@echo "$(YELLOW)✓ Dependencies installed$(RESET)"
	@make dev
	@echo "$(GREEN)✓ Setup complete! Development server is starting...$(RESET)"

dev: ## Start development environment
	@echo "$(GREEN)Starting development environment...$(RESET)"
	@docker-compose up -d
	@echo "$(YELLOW)✓ Services started$(RESET)"
	@echo "$(YELLOW)  - App: http://localhost:3000$(RESET)"
	@echo "$(YELLOW)  - Prisma Studio: http://localhost:5555$(RESET)"
	@echo "$(YELLOW)  - pgAdmin: http://localhost:5050$(RESET)"
	@make wait-for-db
	@make db-setup

dev-build: ## Start development environment with fresh build
	@echo "$(GREEN)Building and starting development environment...$(RESET)"
	@docker-compose up -d --build
	@make wait-for-db
	@make db-setup

dev-native: ## Start development without Docker
	@echo "$(GREEN)Starting native development...$(RESET)"
	@npm run dev

## Database
wait-for-db: ## Wait for database to be ready
	@echo "$(YELLOW)Waiting for database...$(RESET)"
	@until docker-compose exec postgres pg_isready -U postgres > /dev/null 2>&1; do \
		sleep 1; \
	done
	@echo "$(GREEN)✓ Database is ready$(RESET)"

db-setup: ## Setup database schema and seed data
	@echo "$(GREEN)Setting up database (inside Docker)...$(RESET)"
	@docker-compose exec app npm run db:push
	@docker-compose exec app npm run db:seed
	@echo "$(GREEN)✓ Database setup complete$(RESET)"

db-reset: ## Reset database and volumes
	@echo "$(RED)Resetting database...$(RESET)"
	@docker-compose down postgres
	@docker volume rm site_postgres_data 2>/dev/null || true
	@docker-compose up -d postgres
	@make wait-for-db
	@make db-setup
	@echo "$(GREEN)✓ Database reset complete$(RESET)"

db-seed: ## Seed database with sample data
	@echo "$(GREEN)Seeding database (inside Docker)...$(RESET)"
	@docker-compose exec app npm run db:seed
	@echo "$(GREEN)✓ Database seeded$(RESET)"

db-create-admin: ## Create a new admin user
	@echo "$(GREEN)Creating admin user (inside Docker)...$(RESET)"
	@docker-compose exec app npm run create:admin

## Monitoring
logs: ## Show application logs
	@docker-compose logs -f app

logs-all: ## Show all service logs
	@docker-compose logs -f

status: ## Show service status
	@docker-compose ps

## Tools
studio: ## Open Prisma Studio
	@echo "$(GREEN)Opening Prisma Studio...$(RESET)"
	@docker-compose --profile tools up -d prisma-studio
	@echo "$(YELLOW)✓ Prisma Studio: http://localhost:5555$(RESET)"

pgadmin: ## Open pgAdmin
	@echo "$(GREEN)Opening pgAdmin...$(RESET)"
	@docker-compose --profile tools up -d pgadmin
	@echo "$(YELLOW)✓ pgAdmin: http://localhost:5050$(RESET)"
	@echo "$(YELLOW)  Email: admin@muse3d.com$(RESET)"
	@echo "$(YELLOW)  Password: admin123$(RESET)"

tools: ## Start all development tools
	@make studio
	@make pgadmin

## Cleanup
down: ## Stop all services
	@echo "$(RED)Stopping services...$(RESET)"
	@docker-compose down
	@echo "$(GREEN)✓ Services stopped$(RESET)"

clean: ## Clean containers, volumes, and cache
	@echo "$(RED)Cleaning up...$(RESET)"
	@docker-compose down -v --remove-orphans
	@docker system prune -f
	@echo "$(GREEN)✓ Cleanup complete$(RESET)"

## Build & Production
build: ## Build production image
	@echo "$(GREEN)Building production image...$(RESET)"
	@docker build --target production -t muse3dstudio:latest .
	@echo "$(GREEN)✓ Production image built$(RESET)"

prod: ## Start production environment
	@echo "$(GREEN)Starting production environment...$(RESET)"
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
	@echo "$(GREEN)✓ Production environment started$(RESET)"

prod-build: ## Build and start production environment
	@echo "$(GREEN)Building and starting production environment...$(RESET)"
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
	@echo "$(GREEN)✓ Production environment started$(RESET)"

## Health Checks
health: ## Check application health
	@echo "$(GREEN)Checking application health...$(RESET)"
	@curl -f http://localhost:3000/api/health || echo "$(RED)Health check failed$(RESET)"

## Quick Commands
restart: down dev ## Restart development environment
rebuild: down dev-build ## Rebuild and restart development environment
reset: clean setup ## Complete reset and setup

## Testing (Future)
test: ## Run tests (placeholder)
	@echo "$(YELLOW)Tests not implemented yet$(RESET)"

lint: ## Run linting
	@npm run lint

## Info
info: ## Show project information
	@echo "$(GREEN)Muse3DStudio Project Information$(RESET)"
	@echo "$(YELLOW)Development URLs:$(RESET)"
	@echo "  App:           http://localhost:3000"
	@echo "  Admin Panel:   http://localhost:3000/admin"
	@echo "  API Health:    http://localhost:3000/api/health"
	@echo "  Prisma Studio: http://localhost:5555"
	@echo "  pgAdmin:       http://localhost:5050"
	@echo ""
	@echo "$(YELLOW)Useful Commands:$(RESET)"
	@echo "  make dev       - Start development"
	@echo "  make logs      - View app logs"
	@echo "  make studio    - Open Prisma Studio"
	@echo "  make db-reset  - Reset database"
	@echo "  make clean     - Clean everything" 