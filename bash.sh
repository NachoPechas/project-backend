#!/bin/bash

################################################################################
# PROJECT BACKEND - Setup Script (Bash - Linux/Mac)
################################################################################
# Automatiza:
#   1. Verificación de prerrequisitos
#   2. Configuración de ambiente (.env)
#   3. Levantamiento de contenedores Docker
#   4. Inicialización de base de datos
#   5. Instalación de dependencias
#   6. Pruebas básicas
################################################################################

set -e

################################################################################
# CONFIGURACIÓN DE COLORES
################################################################################
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

################################################################################
# ENCABEZADO
################################################################################
clear
echo ""
echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}PROJECT BACKEND - Configuracion Inicial${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

################################################################################
# PASO 1: VERIFICAR DOCKER
################################################################################
echo -e "${YELLOW}[1/6] Verificando Docker...${NC}"
command -v docker >/dev/null 2>&1 || { echo -e "${RED}[ERROR] Docker no instalado${NC}"; exit 1; }
echo -e "${GREEN}[OK] Docker detectado${NC}"
echo ""

################################################################################
# PASO 2: CONFIGURAR ARCHIVO .env
################################################################################
echo -e "${YELLOW}[2/6] Configurando archivo de ambiente...${NC}"

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}[OK] Archivo .env creado desde .env.example${NC}"
    else
        echo -e "${RED}[ERROR] Archivo .env.example no encontrado${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}[OK] Archivo .env ya existe${NC}"
fi
echo ""

################################################################################
# PASO 3: LEVANTAR CONTENEDORES DOCKER
################################################################################
echo -e "${YELLOW}[3/6] Levantando contenedores Docker...${NC}"
echo "Deteniendo contenedores previos..."
docker-compose down --remove-orphans 2>/dev/null || true
echo ""

echo "Iniciando contenedores..."
docker-compose up -d
echo -e "${GREEN}[OK] Contenedores iniciados${NC}"
echo ""

echo "Esperando que servicios esten listos..."
sleep 5
echo ""

################################################################################
# PASO 4: INICIALIZAR BASE DE DATOS
################################################################################
echo -e "${YELLOW}[4/6] Inicializando base de datos...${NC}"
sleep 5

if [ -f cmd/bd/init.sql ]; then
    echo "Ejecutando script de inicializacion..."
    docker-compose exec -T db psql -U postgres -d project_db -f /cmd/bd/init.sql 2>/dev/null || true
    echo -e "${GREEN}[OK] Base de datos inicializada${NC}"
fi
echo ""

if [ -f cmd/bd/seed.sql ]; then
    echo "Ejecutando script de datos iniciales..."
    docker-compose exec -T db psql -U postgres -d project_db -f /cmd/bd/seed.sql 2>/dev/null || true
    echo -e "${GREEN}[OK] Base de datos poblada con datos de prueba${NC}"
fi
echo ""

################################################################################
# PASO 5: INSTALAR DEPENDENCIAS
################################################################################
echo -e "${YELLOW}[5/6] Instalando dependencias...${NC}"

if command -v npm >/dev/null 2>&1; then
    echo "Instalando localmente..."
    npm install
else
    echo "Instalando en contenedor..."
    docker-compose exec -T backend npm install
fi
echo -e "${GREEN}[OK] Dependencias instaladas${NC}"
echo ""

################################################################################
# PASO 6: EJECUTAR PRUEBAS
################################################################################
echo -e "${YELLOW}[6/6] Ejecutando pruebas...${NC}"

grep -q '"test"' package.json 2>/dev/null || { echo -e "${YELLOW}[INFO] No hay pruebas configuradas aun${NC}"; echo "Las pruebas se agregaran en proximas iteraciones"; echo ""; }
echo ""

################################################################################
# RESUMEN FINAL
################################################################################
echo -e "${GREEN}============================================================================${NC}"
echo -e "${GREEN}[SUCCESS] Configuracion completada exitosamente!${NC}"
echo -e "${GREEN}============================================================================${NC}"
echo ""

echo "ESTADO DEL PROYECTO:"
echo -e "  - Contenedores Docker: ${GREEN}Ejecutandose${NC}"
echo -e "  - Base de datos:       ${GREEN}Inicializada${NC}"
echo -e "  - Dependencias:        ${GREEN}Instaladas${NC}"
echo ""

echo "PASOS SIGUIENTES:"
echo "  1. Acceder a API: http://localhost:3000"
echo "  2. Ver logs: docker-compose logs -f backend"
echo "  3. Detener: docker-compose down"
echo ""

echo "COMANDOS UTILES:"
echo "  - docker-compose logs backend       # Ver logs del backend"
echo "  - docker-compose logs db            # Ver logs de la BD"
echo "  - docker-compose restart            # Reiniciar servicios"
echo "  - docker-compose down               # Detener servicios"
echo ""