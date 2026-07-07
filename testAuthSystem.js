require('dotenv').config();

const sequelize = require('./src/config/database');
const registrerService = require('./src/services/registrerService'); // Ajusta a tu servicio de registro
const authService = require('./src/services/authService');           // Ajusta a tu servicio de auth

async function correrPruebaAutenticacion() {
  try {
    console.log('🔄 Conectando a la base de datos para pruebas de Auth...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida.\n');

    // Definimos un correo único para la prueba para que no falle por duplicado si lo corres varias veces
    const correoPrueba = `estudiante.test${Math.floor(Math.random() * 10000)}@unal.edu.co`;
    const claveCorrecta = 'ClaveSegura123';
    const claveIncorrecta = 'ClaveErronea999';

    // ==========================================
    // ESCENARIO 1: Registro Exitoso (Encriptando contraseña)
    // ==========================================
    console.log(`=== 📥 PROBANDO REQUERIMIENTO 11: REGISTRO ===`);
    console.log(`Registrando nuevo estudiante con correo: ${correoPrueba}...`);
    
    const nuevoUsuario = await registrerService.registerStudent({
      name: 'Usuario Prueba Auth',
      nombre: 'Usuario Prueba Auth',
      email: correoPrueba,
      password: claveCorrecta
    });

    console.log(`\n==================================================`);
    console.log(`✅ ¡ÉXITO! Usuario registrado en la Base de Datos.`);
    console.log(`• ID Asignado: ${nuevoUsuario.id}`);
    console.log(`• Contraseña Hasheada guardada: ${nuevoUsuario.password ? nuevoUsuario.password.substring(0, 20) + '...' : 'Cifrada exitosamente'}`);
    console.log(`==================================================\n`);


    // ==========================================
    // ESCENARIO 2: Inicio de Sesión Exitoso (JWT)
    // ==========================================
    console.log(`=== 📥 PROBANDO REQUERIMIENTO 12: LOGIN EXITOSO ===`);
    console.log(`Intentando iniciar sesión con credenciales correctas...`);

    const loginExitoso = await authService.login(correoPrueba, claveCorrecta);

    console.log(`\n==================================================`);
    console.log(`✅ ¡LOGIN CORRECTO!`);
    console.log(`• Token JWT Generado: ${loginExitoso.token.substring(0, 40)}...`);
    console.log(`• Bienvenido: ${loginExitoso.user.name} [Rol: ${loginExitoso.user.role_id}]`);
    console.log(`==================================================\n`);


    // ==========================================
    // ESCENARIO 3: Forzar Bloqueo tras 3 Intentos Fallidos
    // ==========================================
    console.log(`=== 📥 PROBANDO REQUERIMIENTO 12: CONTROLLER DE BLOQUEO ===`);
    console.log(`Iniciando ráfaga de 3 intentos fallidos para forzar el bloqueo...`);

    for (let intento = 1; intento <= 4; intento++) {
      console.log(`\n👉 Intento fallido #${intento} con contraseña incorrecta...`);
      try {
        await authService.login(correoPrueba, claveIncorrecta);
      } catch (error) {
        if (error.status === 423) {
          console.log(`\n==================================================`);
          console.log(`🔒 ¡CUENTA BLOQUEADA EXITOSAMENTE POR EL SISTEMA!`);
          console.log(`• Mensaje del Servidor: ${error.message}`);
          console.log(`• Código de Estado HTTP: ${error.status}`);
          console.log(`==================================================\n`);
        } else {
          console.log(`❌ Fallo controlado: ${error.message} (Status: ${error.status})`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error crítico en el script de pruebas de autenticación:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Conexión de base de datos cerrada. Pruebas de Auth completadas.');
  }
}

correrPruebaAutenticacion();