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

## Production Sync
sync-from-prod: ## Sync database from production server
	@echo "$(GREEN)Syncing database from production...$(RESET)"
	@echo "$(YELLOW)⚠️  This will replace your local database with production data$(RESET)"
	@read -p "Enter production database URL (or press Enter to use env): " PROD_DB_URL; \
	if [ -z "$$PROD_DB_URL" ]; then \
		PROD_DB_URL=$$(grep PRODUCTION_DATABASE_URL .env.local 2>/dev/null | cut -d '=' -f2- | tr -d '"') || \
		PROD_DB_URL=$$(grep DATABASE_URL_PROD .env.local 2>/dev/null | cut -d '=' -f2- | tr -d '"'); \
	fi; \
	if [ -z "$$PROD_DB_URL" ]; then \
		echo "$(RED)❌ Production database URL not found!$(RESET)"; \
		echo "$(YELLOW)Please add PRODUCTION_DATABASE_URL to .env.local$(RESET)"; \
		exit 1; \
	fi; \
	make _sync-database PROD_URL="$$PROD_DB_URL"

_sync-database: ## Internal: sync database with given URL
	@echo "$(GREEN)Creating production dump...$(RESET)"
	@docker-compose exec postgres pg_dump "$(PROD_URL)" --no-owner --no-acl --clean --if-exists > /tmp/prod_dump.sql
	@echo "$(GREEN)Restoring to local database...$(RESET)"
	@docker-compose exec -T postgres psql -U postgres -d muse3dstudio < /tmp/prod_dump.sql
	@rm /tmp/prod_dump.sql
	@echo "$(GREEN)✓ Production data synced successfully$(RESET)"

dump-local: ## Create backup of local database
	@echo "$(GREEN)Creating local database dump...$(RESET)"
	@mkdir -p backups
	@docker-compose exec postgres pg_dump -U postgres muse3dstudio > backups/local_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Local backup created in backups/$(RESET)"

restore-from-backup: ## Restore database from backup file
	@echo "$(GREEN)Available backups:$(RESET)"
	@ls -la backups/*.sql 2>/dev/null || echo "$(YELLOW)No backups found$(RESET)"
	@read -p "Enter backup filename (from backups/): " BACKUP_FILE; \
	if [ -f "backups/$$BACKUP_FILE" ]; then \
		echo "$(GREEN)Restoring from backups/$$BACKUP_FILE...$(RESET)"; \
		docker-compose exec -T postgres psql -U postgres -d muse3dstudio < "backups/$$BACKUP_FILE"; \
		echo "$(GREEN)✓ Database restored$(RESET)"; \
	else \
		echo "$(RED)❌ Backup file not found$(RESET)"; \
	fi

auto-sync: ## Auto-sync with production (scheduled)
	@echo "$(GREEN)Setting up auto-sync from production...$(RESET)"
	@echo "$(YELLOW)This will sync every 6 hours automatically$(RESET)"
	@(crontab -l 2>/dev/null; echo "0 */6 * * * cd $(PWD) && make sync-from-prod >/dev/null 2>&1") | crontab -
	@echo "$(GREEN)✓ Auto-sync configured (every 6 hours)$(RESET)" 

## Production Deployment & Server Management
deploy-server: ## Deploy to production server (requires SERVER_IP and SERVER_USER env vars)
	@echo "$(GREEN)Deploying to production server...$(RESET)"
	@if [ -z "$(SERVER_IP)" ]; then echo "$(RED)❌ SERVER_IP environment variable required$(RESET)"; exit 1; fi
	@if [ -z "$(SERVER_USER)" ]; then echo "$(RED)❌ SERVER_USER environment variable required$(RESET)"; exit 1; fi
	@echo "$(YELLOW)Deploying to $(SERVER_USER)@$(SERVER_IP)$(RESET)"
	@rsync -avz --delete --exclude node_modules --exclude .git --exclude .env* . $(SERVER_USER)@$(SERVER_IP):/var/www/muse3dstudio/
	@ssh $(SERVER_USER)@$(SERVER_IP) "cd /var/www/muse3dstudio && make prod-down && make prod-build && make prod-db-setup"
	@echo "$(GREEN)✓ Deployment complete$(RESET)"

deploy-quick: ## Quick deploy (only code changes, no rebuild)
	@echo "$(GREEN)Quick deploying to production server...$(RESET)"
	@if [ -z "$(SERVER_IP)" ]; then echo "$(RED)❌ SERVER_IP environment variable required$(RESET)"; exit 1; fi
	@if [ -z "$(SERVER_USER)" ]; then echo "$(RED)❌ SERVER_USER environment variable required$(RESET)"; exit 1; fi
	@rsync -avz --delete --exclude node_modules --exclude .git --exclude .env* . $(SERVER_USER)@$(SERVER_IP):/var/www/muse3dstudio/
	@ssh $(SERVER_USER)@$(SERVER_IP) "cd /var/www/muse3dstudio && docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart app nginx"
	@echo "$(GREEN)✓ Quick deployment complete$(RESET)"

server-status: ## Check production server status
	@echo "$(GREEN)Checking production server status...$(RESET)"
	@if [ -z "$(SERVER_IP)" ]; then echo "$(RED)❌ SERVER_IP environment variable required$(RESET)"; exit 1; fi
	@if [ -z "$(SERVER_USER)" ]; then echo "$(RED)❌ SERVER_USER environment variable required$(RESET)"; exit 1; fi
	@ssh $(SERVER_USER)@$(SERVER_IP) "cd /var/www/muse3dstudio && docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps"

server-logs: ## View production server logs
	@echo "$(GREEN)Viewing production server logs...$(RESET)"
	@if [ -z "$(SERVER_IP)" ]; then echo "$(RED)❌ SERVER_IP environment variable required$(RESET)"; exit 1; fi
	@if [ -z "$(SERVER_USER)" ]; then echo "$(RED)❌ SERVER_USER environment variable required$(RESET)"; exit 1; fi
	@ssh $(SERVER_USER)@$(SERVER_IP) "cd /var/www/muse3dstudio && docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f app"

server-restart: ## Restart production services
	@echo "$(GREEN)Restarting production services...$(RESET)"
	@if [ -z "$(SERVER_IP)" ]; then echo "$(RED)❌ SERVER_IP environment variable required$(RESET)"; exit 1; fi
	@if [ -z "$(SERVER_USER)" ]; then echo "$(RED)❌ SERVER_USER environment variable required$(RESET)"; exit 1; fi
	@ssh $(SERVER_USER)@$(SERVER_IP) "cd /var/www/muse3dstudio && docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart"
	@echo "$(GREEN)✓ Services restarted$(RESET)"

server-health: ## Check production server health
	@echo "$(GREEN)Checking production server health...$(RESET)"
	@if [ -z "$(SERVER_IP)" ]; then echo "$(RED)❌ SERVER_IP environment variable required$(RESET)"; exit 1; fi
	@curl -f http://$(SERVER_IP)/api/health || echo "$(RED)Health check failed$(RESET)"

prod-down: ## Stop production environment
	@echo "$(RED)Stopping production environment...$(RESET)"
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
	@echo "$(GREEN)✓ Production environment stopped$(RESET)"

prod-db-setup: ## Setup production database
	@echo "$(GREEN)Setting up production database...$(RESET)"
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec app npm run db:push
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec app npm run db:seed
	@echo "$(GREEN)✓ Production database setup complete$(RESET)"

## Raspberry Pi Deployment
rpi-setup: ## Setup Raspberry Pi from scratch
	@echo "$(GREEN)Setting up Raspberry Pi...$(RESET)"
	@./scripts/setup-rpi.sh
	@echo "$(GREEN)✓ Raspberry Pi setup complete$(RESET)"

rpi-deploy: ## Deploy to Raspberry Pi (requires SSH access)
	@echo "$(GREEN)Deploying to Raspberry Pi...$(RESET)"
	@if [ -z "$(RPI_HOST)" ]; then echo "$(RED)❌ RPI_HOST environment variable required (e.g., 192.168.1.8)$(RESET)"; exit 1; fi
	@if [ -z "$(RPI_USER)" ]; then echo "$(RED)❌ RPI_USER environment variable required (e.g., muse3dstudio)$(RESET)"; exit 1; fi
	@echo "$(YELLOW)Deploying to $(RPI_USER)@$(RPI_HOST)$(RESET)"
	@rsync -avz --delete --exclude node_modules --exclude .git --exclude .env* . $(RPI_USER)@$(RPI_HOST):~/muse3dstudio/web-app/
	@ssh $(RPI_USER)@$(RPI_HOST) "cd ~/muse3dstudio/web-app && npm install && npx prisma generate"
	@ssh $(RPI_USER)@$(RPI_HOST) "sudo cp ~/muse3dstudio/web-app/systemd/*.service /etc/systemd/system/ && sudo systemctl daemon-reload"
	@ssh $(RPI_USER)@$(RPI_HOST) "sudo docker compose up -d postgres redis && sudo systemctl restart muse3d-web.service cloudflare-tunnel.service"
	@echo "$(GREEN)✓ Raspberry Pi deployment complete$(RESET)"

rpi-status: ## Check Raspberry Pi services status
	@echo "$(GREEN)Checking Raspberry Pi status...$(RESET)"
	@if [ -z "$(RPI_HOST)" ]; then echo "$(RED)❌ RPI_HOST environment variable required$(RESET)"; exit 1; fi
	@if [ -z "$(RPI_USER)" ]; then echo "$(RED)❌ RPI_USER environment variable required$(RESET)"; exit 1; fi
	@ssh $(RPI_USER)@$(RPI_HOST) "sudo systemctl is-active muse3d-web.service cloudflare-tunnel.service && sudo docker compose ps"

rpi-logs: ## View Raspberry Pi application logs
	@echo "$(GREEN)Viewing Raspberry Pi logs...$(RESET)"
	@if [ -z "$(RPI_HOST)" ]; then echo "$(RED)❌ RPI_HOST environment variable required$(RESET)"; exit 1; fi
	@if [ -z "$(RPI_USER)" ]; then echo "$(RED)❌ RPI_USER environment variable required$(RESET)"; exit 1; fi
	@ssh $(RPI_USER)@$(RPI_HOST) "sudo journalctl -u muse3d-web.service -f"

rpi-health: ## Check Raspberry Pi application health
	@echo "$(GREEN)Checking Raspberry Pi application health...$(RESET)"
	@if [ -z "$(RPI_HOST)" ]; then echo "$(RED)❌ RPI_HOST environment variable required$(RESET)"; exit 1; fi
	@curl -f http://$(RPI_HOST):3000/api/health || echo "$(RED)Health check failed$(RESET)"

rpi-restart: ## Restart Raspberry Pi services
	@echo "$(GREEN)Restarting Raspberry Pi services...$(RESET)"
	@if [ -z "$(RPI_HOST)" ]; then echo "$(RED)❌ RPI_HOST environment variable required$(RESET)"; exit 1; fi
	@if [ -z "$(RPI_USER)" ]; then echo "$(RED)❌ RPI_USER environment variable required$(RESET)"; exit 1; fi
	@ssh $(RPI_USER)@$(RPI_HOST) "sudo systemctl restart muse3d-web.service cloudflare-tunnel.service && sudo docker compose restart postgres redis"
	@echo "$(GREEN)✓ Raspberry Pi services restarted$(RESET)" 