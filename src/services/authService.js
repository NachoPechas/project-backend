const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async login(email, plainPassword) {
        const cleanedEmail = email.trim().toLowerCase();
        
        const user = await userRepository.findByEmail(cleanedEmail);
        if (!user) {
            const error = new Error('Credenciales incorrectas o el usuario no existe.');
            error.status = 401;
            throw error;
        }

        const normalizedStatus = String(user.status || '')
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        if (normalizedStatus === 'suspendido' || normalizedStatus === 'blocked' || normalizedStatus === 'bloqueado') {
            const error = new Error('Usuario suspendido temporalmente por incumplimientos de reservas.');
            error.status = 403;
            throw error;
        }

        if (user.lockUntil) {
            const ahoraUTC = Date.now();
            const bloqueoUTC = new Date(user.lockUntil).getTime();

            if (ahoraUTC < bloqueoUTC) {
                let minutosRestantes = Math.ceil((bloqueoUTC - ahoraUTC) / 60000);

                if (minutosRestantes > 15) {
                    const miDesfaseHorario = new Date().getTimezoneOffset();
                    minutosRestantes = minutosRestantes - miDesfaseHorario;
                }

                const error = new Error(`Cuenta bloqueada temporalmente. Intenta de nuevo en ${minutosRestantes} min.`);
                error.status = 423; 
                throw error;
            }
        }

        if (!user.password) {
            const error = new Error('Este usuario no tiene contrasena local configurada.');
            error.status = 401;
            throw error;
        }

        const passwordIsHashed =
            user.password.startsWith('$2a$') ||
            user.password.startsWith('$2b$') ||
            user.password.startsWith('$2y$');

        const isPasswordValid = passwordIsHashed
            ? await bcrypt.compare(plainPassword, user.password)
            : plainPassword === user.password;

        if (!isPasswordValid) {
            const nuevoIntento = (user.loginAttempts || 0) + 1;
            let dataUpdate = { loginAttempts: nuevoIntento };

            if (nuevoIntento >= 3) {
                const tiempoBloqueo = new Date(Date.now() + 15 * 60 * 1000); 
                
                dataUpdate.lockUntil = tiempoBloqueo;
                dataUpdate.loginAttempts = 0; 
                
                await userRepository.update(user.id, dataUpdate);
                const error = new Error('Cuenta bloqueada tras 3 intentos fallidos por seguridad.');
                error.status = 423;
                throw error;
            }

            await userRepository.update(user.id, dataUpdate);
            const error = new Error('Contraseña incorrecta.');
            error.status = 401;
            throw error;
        }

        await userRepository.update(user.id, { loginAttempts: 0, lockUntil: null });

        const token = jwt.sign(
            { id: user.id, roleId: user.roleId, email: user.email },
            process.env.JWT_SECRET || 'secret_token_key_unal',
            { expiresIn: '4h' }
        );

        return { token, user };
    }
}

module.exports = new AuthService();
