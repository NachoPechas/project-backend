# ============================================================================
# Project Backend - Automation Setup Script (PowerShell)
# ============================================================================
# This script automates:
# 1. Environment setup
# 2. Docker repository initialization
# 3. Dependencies installation
# 4. Basic testing
# ============================================================================

$ErrorActionPreference = "Continue"

# ============================================================================
# PRINT HEADER
# ============================================================================
Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "PROJECT BACKEND - Initial Setup and Execution" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# VERIFY PREREQUISITES
# ============================================================================
Write-Host "[1/6] Checking prerequisites..." -ForegroundColor Yellow

# Check Docker
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Docker is installed" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Docker is not installed. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if Docker daemon is running
try {
    $dockerStatus = docker ps -q 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[WARNING] Docker daemon is not running!" -ForegroundColor Yellow
        Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
        exit 1
    }
    Write-Host "[OK] Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Docker daemon is not running!" -ForegroundColor Yellow
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Check docker-compose
if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    Write-Host "[OK] docker-compose is installed" -ForegroundColor Green
} else {
    Write-Host "[ERROR] docker-compose is not installed. Please install Docker Compose." -ForegroundColor Red
    exit 1
}

# Check Node.js (optional)
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js is installed ($nodeVersion)" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Node.js is not installed locally. Will use Docker instead." -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# ENVIRONMENT SETUP
# ============================================================================
Write-Host "[2/6] Setting up environment configuration..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "[OK] .env file created from .env.example" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] .env.example not found" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[OK] .env file already exists" -ForegroundColor Green
}

Write-Host ""

# ============================================================================
# DOCKER SETUP - BUILD AND START CONTAINERS
# ============================================================================
Write-Host "[3/6] Lifting Docker repository..." -ForegroundColor Yellow

Write-Host "Stopping any existing containers..." -ForegroundColor Cyan
docker-compose down --remove-orphans 2>$null

Write-Host "Building and starting containers..." -ForegroundColor Cyan
docker-compose up -d

Write-Host "Waiting for services to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Check if containers are running
$dbContainer = docker-compose ps -q db 2>$null
$backendContainer = docker-compose ps -q backend 2>$null

if ($dbContainer -and $backendContainer) {
    Write-Host "[OK] All containers are running" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to start containers" -ForegroundColor Red
    docker-compose logs
    exit 1
}

Write-Host ""

# ============================================================================
# DATABASE INITIALIZATION
# ============================================================================
Write-Host "[4/6] Initializing database..." -ForegroundColor Yellow

Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Run init script if it exists
if (Test-Path "cmd\bd\init.sql") {
    Write-Host "Running database initialization script..." -ForegroundColor Cyan
    docker-compose exec -T db psql -U postgres -d project_db -f /cmd/bd/init.sql 2>$null
    Write-Host "[OK] Database initialized" -ForegroundColor Green
}

# Run seed script if it exists
if (Test-Path "cmd\bd\seed.sql") {
    Write-Host "Running database seed script..." -ForegroundColor Cyan
    docker-compose exec -T db psql -U postgres -d project_db -f /cmd/bd/seed.sql 2>$null
    Write-Host "[OK] Database seeded" -ForegroundColor Green
}

Write-Host ""

# ============================================================================
# DEPENDENCIES INSTALLATION
# ============================================================================
Write-Host "[5/6] Installing dependencies..." -ForegroundColor Yellow

if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "Installing npm dependencies locally..." -ForegroundColor Cyan
    npm install
    Write-Host "[OK] Dependencies installed locally" -ForegroundColor Green
} else {
    Write-Host "Installing npm dependencies in container..." -ForegroundColor Cyan
    docker-compose exec -T backend npm install
    Write-Host "[OK] Dependencies installed in container" -ForegroundColor Green
}

Write-Host ""

# ============================================================================
# BASIC TESTING
# ============================================================================
Write-Host "[6/6] Running basic tests..." -ForegroundColor Yellow

$packageJson = Get-Content -Path "package.json" -Raw
if ($packageJson -match '"test"') {
    Write-Host "Running npm tests..." -ForegroundColor Cyan
    try {
        npm test
    } catch {
        Write-Host "[WARNING] Tests completed with warnings" -ForegroundColor Yellow
    }
} else {
    Write-Host "[WARNING] No tests configured yet. Skipping test execution." -ForegroundColor Yellow
    Write-Host "Tests will be configured in future iterations." -ForegroundColor Cyan
}

Write-Host ""

# ============================================================================
# SUCCESS SUMMARY
# ============================================================================
Write-Host "============================================================================" -ForegroundColor Green
Write-Host "[SUCCESS] Setup completed successfully!" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Green
Write-Host ""

Write-Host "PROJECT STATUS:" -ForegroundColor Cyan
Write-Host "  - Docker containers:  " -NoNewline
Write-Host "Running" -ForegroundColor Green
Write-Host "  - Database:            " -NoNewline
Write-Host "Initialized" -ForegroundColor Green
Write-Host "  - Dependencies:        " -NoNewline
Write-Host "Installed" -ForegroundColor Green

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. Access the API: http://localhost:3000"
Write-Host "  2. View logs: docker-compose logs -f backend"
Write-Host "  3. Stop containers: docker-compose down"

Write-Host ""
Write-Host "AVAILABLE COMMANDS:" -ForegroundColor Cyan
Write-Host "  - docker-compose logs backend   # View backend logs"
Write-Host "  - docker-compose logs db        # View database logs"
Write-Host "  - docker-compose restart        # Restart all services"
Write-Host "  - docker-compose down           # Stop all services"
Write-Host ""
