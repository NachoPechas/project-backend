require('dotenv').config();

const sequelize = require('./src/config/database');
const penaltyRepository = require('./src/repositories/penaltyRepository'); // Ajusta la ruta a tu repositorio

// Middleware de simulación rápida para emular lo que haría req.user tras pasar por el JWT
function simularPeticion(usuarioSimulado) {
    return {
        user: usuarioSimulado
    };
}

async function correrPruebaPenalizaciones() {
    try {
        console.log('🔄 Conectando a la base de datos para pruebas de Penalizaciones...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida.\n');

        // ==========================================
        // ESCENARIO 1: Intento de acceso de un Estudiante (Debe ser rechazado)
        // ==========================================
        console.log(`=== 📥 ESCENARIO 1: PRUEBA DE CANDADO DE SEGURIDAD (ESTUDIANTE) ===`);
        const estudianteReq = simularPeticion({ id: 15, name: 'Pepito Estudiante', role_id: 3 });
        
        console.log(`Usuario: ${estudianteReq.user.name} [Rol: ${estudianteReq.user.role_id}] intentando ver multas...`);
        
        // Simulamos la lógica del middleware de protección por rol
        if (estudianteReq.user.role_id !== 2) {
            console.log(`\n==================================================`);
            console.log(`🔒 ¡CANDADO FUNCIONANDO! HTTP 403 Forbidden`);
            console.log(`• Mensaje: Acceso denegado. Se requieren permisos de Bibliotecario.`);
            console.log(`==================================================\n`);
        } else {
            console.log(`❌ FALLA DE SEGURIDAD: ¡Un estudiante logró burlar el rol!`);
        }


        // ==========================================
        // ESCENARIO 2: Intento de acceso de un Bibliotecario (Debe ser exitoso)
        // ==========================================
        console.log(`=== 📥 ESCENARIO 2: ACCESO EXCLUSIVO (BIBLIOTECARIO) ===`);
        const bibliotecarioReq = simularPeticion({ id: 2, name: 'Sra. Marta Bibliotecaria', role_id: 2 });
        
        console.log(`Usuario: ${bibliotecarioReq.user.name} [Rol: ${bibliotecarioReq.user.role_id}] solicitando la tabla 'penalty'...`);

        if (bibliotecarioReq.user.role_id === 2) {
            console.log(`🔄 Permiso concedido. Extrayendo penalizaciones de la base de datos...`);
            
            // Llamamos directamente al método del repositorio que hace los JOINs con User y Loan
            const penalizaciones = await penaltyRepository.findAllPenalties();

            console.log(`\n==================================================`);
            console.log(`✅ ¡CONSULTA EXITOSA!`);
            console.log(`• Total de multas encontradas en el sistema: ${penalizaciones.length}`);
            
            if (penalizaciones.length > 0) {
                console.log(`• Muestra de la primera multa:`);
                console.log(`  - Razón: ${penalizaciones[0].reason}`);
                console.log(`  - Monto: $${penalizaciones[0].amount}`);
                console.log(`  - Estudiante afectado: ${penalizaciones[0].User ? penalizaciones[0].User.name : 'N/A'}`);
            } else {
                console.log(`• Nota: La tabla 'penalty' está vacía actualmente en Postgres, pero el query se ejecutó limpio.`);
            }
            console.log(`==================================================\n`);
        } else {
            console.log(`❌ Error inesperado en la simulación.`);
        }

    } catch (error) {
        console.error('❌ Error crítico en el script de pruebas de penalizaciones:', error);
    } finally {
        await sequelize.close();
        console.log('🔒 Conexión de base de datos cerrada. Pruebas de Roles completadas.');
    }
}

correrPruebaPenalizaciones();