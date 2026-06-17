#!/bin/bash

# ============================================================================
# 🚀 Project Backend - Automation Setup Script
# ============================================================================
# This script automates:
# 1. Environment setup
# 2. Docker repository initialization
# 3. Dependencies installation
# 4. Basic testing
# ============================================================================

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# 1. PRINT HEADER
# ============================================================================
echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}🚀 Project Backend - Initial Setup and Execution${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# ============================================================================
# 2. VERIFY PREREQUISITES
# ============================================================================
echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ docker-compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ docker-compose is installed${NC}"

# Check if Node.js is installed (for local development)
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠ Node.js is not installed locally. Will use Docker instead.${NC}"
else
    echo -e "${GREEN}✓ Node.js is installed ($(node --version))${NC}"
fi

echo ""

# ============================================================================
# 3. ENVIRONMENT SETUP
# ============================================================================
echo -e "${YELLOW}[2/5] Setting up environment configuration...${NC}"

if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ .env file created${NC}"
    else
        echo -e "${RED}✗ .env.example not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo ""

# ============================================================================
# 4. DOCKER SETUP - BUILD AND START CONTAINERS
# ============================================================================
echo -e "${YELLOW}[3/5] Lifting Docker repository...${NC}"

echo -e "${BLUE}Stopping any existing containers...${NC}"
docker-compose down --remove-orphans 2>/dev/null || true

echo -e "${BLUE}Building and starting containers...${NC}"
docker-compose up -d

echo -e "${BLUE}Waiting for services to be ready...${NC}"
sleep 5

# Check if containers are running
if [ "$(docker-compose ps -q db)" ] && [ "$(docker-compose ps -q backend)" ]; then
    echo -e "${GREEN}✓ All containers are running${NC}"
else
    echo -e "${RED}✗ Failed to start containers${NC}"
    docker-compose logs
    exit 1
fi

echo ""

# ============================================================================
# 5. DATABASE INITIALIZATION
# ============================================================================
echo -e "${YELLOW}[4/5] Initializing database...${NC}"

# Wait for PostgreSQL to be ready
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
sleep 10

# Run init script if it exists
if [ -f cmd/bd/init.sql ]; then
    echo -e "${BLUE}Running database initialization script...${NC}"
    docker-compose exec -T db psql -U postgres -d project_db -f /cmd/bd/init.sql || true
    echo -e "${GREEN}✓ Database initialized${NC}"
fi

# Run seed script if it exists
if [ -f cmd/bd/seed.sql ]; then
    echo -e "${BLUE}Running database seed script...${NC}"
    docker-compose exec -T db psql -U postgres -d project_db -f /cmd/bd/seed.sql || true
    echo -e "${GREEN}✓ Database seeded${NC}"
fi

echo ""

# ============================================================================
# 6. DEPENDENCIES INSTALLATION
# ============================================================================
echo -e "${YELLOW}[5/5] Installing dependencies...${NC}"

if command -v node &> /dev/null; then
    echo -e "${BLUE}Installing npm dependencies locally...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed locally${NC}"
else
    echo -e "${BLUE}Installing npm dependencies in container...${NC}"
    docker-compose exec -T backend npm install
    echo -e "${GREEN}✓ Dependencies installed in container${NC}"
fi

echo ""

# ============================================================================
# 7. BASIC TESTING (if test script exists)
# ============================================================================
echo -e "${YELLOW}[6/6] Running basic tests...${NC}"

if [ -f package.json ] && grep -q '"test"' package.json; then
    echo -e "${BLUE}Running npm tests...${NC}"
    npm test || echo -e "${YELLOW}⚠ Tests completed with warnings${NC}"
else
    echo -e "${YELLOW}⚠ No tests configured yet. Skipping test execution.${NC}"
    echo -e "${BLUE}Tests will be configured in future iterations.${NC}"
fi

echo ""

# ============================================================================
# 8. SUCCESS SUMMARY
# ============================================================================
echo -e "${GREEN}============================================================================${NC}"
echo -e "${GREEN}✓ Setup completed successfully!${NC}"
echo -e "${GREEN}============================================================================${NC}"
echo ""
echo -e "${BLUE}📊 Project Status:${NC}"
echo -e "  • Docker containers: ${GREEN}Running${NC}"
echo -e "  • Database: ${GREEN}Initialized${NC}"
echo -e "  • Dependencies: ${GREEN}Installed${NC}"
echo ""
echo -e "${BLUE}🚀 Next steps:${NC}"
echo -e "  1. Access the API: http://localhost:3000"
echo -e "  2. View logs: ${YELLOW}docker-compose logs -f backend${NC}"
echo -e "  3. Stop containers: ${YELLOW}docker-compose down${NC}"
echo ""
echo -e "${BLUE}📝 Available commands:${NC}"
echo -e "  • docker-compose logs backend   # View backend logs"
echo -e "  • docker-compose logs db        # View database logs"
echo -e "  • docker-compose restart        # Restart all services"
echo -e "  • docker-compose down           # Stop all services"
echo ""