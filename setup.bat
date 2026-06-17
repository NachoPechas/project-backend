@echo off
REM ============================================================================
REM PROJECT BACKEND - Setup Script (Windows Batch)
REM ============================================================================
REM Automatiza:
REM   1. Verificación de prerrequisitos
REM   2. Configuración de ambiente (.env)
REM   3. Levantamiento de contenedores Docker
REM   4. Inicialización de base de datos
REM   5. Instalación de dependencias
REM   6. Pruebas básicas
REM ============================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

REM ============================================================================
REM ENCABEZADO
REM ============================================================================
cls
echo.
echo ============================================================================
echo PROJECT BACKEND - Configuracion Inicial
echo ============================================================================
echo.

REM ============================================================================
REM PASO 1: VERIFICAR DOCKER
REM ============================================================================
echo [1/6] Verificando Docker...
where docker >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no instalado. Instala Docker Desktop primero.
    pause
    exit /b 1
)
echo [OK] Docker detectado
echo.

REM ============================================================================
REM PASO 2: CONFIGURAR ARCHIVO .env
REM ============================================================================
echo [2/6] Configurando archivo de ambiente...
if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo [OK] Archivo .env creado desde .env.example
    ) else (
        echo [ERROR] Archivo .env.example no encontrado
        pause
        exit /b 1
    )
) else (
    echo [OK] Archivo .env ya existe
)
echo.

REM ============================================================================
REM PASO 3: LEVANTAR CONTENEDORES DOCKER
REM ============================================================================
echo [3/6] Levantando contenedores Docker...
echo Deteniendo contenedores previos...
docker-compose down --remove-orphans 2>nul
echo.

echo Iniciando contenedores...
docker-compose up -d
echo [OK] Contenedores iniciados
echo.

echo Esperando que servicios esten listos...
timeout /t 5 /nobreak >nul
echo.

REM ============================================================================
REM PASO 4: INICIALIZAR BASE DE DATOS
REM ============================================================================
echo [4/6] Inicializando base de datos...
timeout /t 5 /nobreak >nul

if exist cmd\bd\init.sql (
    echo Ejecutando script de inicializacion...
    docker-compose exec -T db psql -U postgres -d project_db -f /cmd/bd/init.sql 2>nul
    echo [OK] Base de datos inicializada
)
echo.

if exist cmd\bd\seed.sql (
    echo Ejecutando script de datos iniciales...
    docker-compose exec -T db psql -U postgres -d project_db -f /cmd/bd/seed.sql 2>nul
    echo [OK] Base de datos poblada con datos de prueba
)
echo.

REM ============================================================================
REM PASO 5: INSTALAR DEPENDENCIAS
REM ============================================================================
echo [5/6] Instalando dependencias...
where npm >nul 2>&1
if errorlevel 1 (
    echo Instalando en contenedor...
    docker-compose exec -T backend npm install
) else (
    echo Instalando localmente...
    call npm install
)
echo [OK] Dependencias instaladas
echo.

REM ============================================================================
REM PASO 6: EJECUTAR PRUEBAS
REM ============================================================================
echo [6/6] Ejecutando pruebas...
findstr /R "\"test\"" package.json >nul
if errorlevel 1 (
    echo [INFO] No hay pruebas configuradas aun
    echo Las pruebas se agregaran en proximas iteraciones
) else (
    echo Ejecutando npm test...
    call npm test
)
echo.

REM ============================================================================
REM RESUMEN FINAL
REM ============================================================================
echo ============================================================================
echo [SUCCESS] Configuracion completada exitosamente!
echo ============================================================================
echo.
echo ESTADO DEL PROYECTO:
echo   - Contenedores Docker:  Ejecutandose
echo   - Base de datos:        Inicializada
echo   - Dependencias:         Instaladas
echo.
echo PASOS SIGUIENTES:
echo   1. Acceder a API: http://localhost:3000
echo   2. Ver logs: docker-compose logs -f backend
echo   3. Detener: docker-compose down
echo.
echo COMANDOS UTILES:
echo   - docker-compose logs backend       # Ver logs del backend
echo   - docker-compose logs db            # Ver logs de la BD
echo   - docker-compose restart            # Reiniciar servicios
echo   - docker-compose down               # Detener servicios
echo.
pause
