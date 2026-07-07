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

        if (user.lock_until) {
            const ahoraUTC = Date.now();
            const bloqueoUTC = new Date(user.lock_until).getTime();

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

        const isPasswordValid = await bcrypt.compare(plainPassword, user.password);

        if (!isPasswordValid) {
            const nuevoIntento = (user.login_attempts || 0) + 1;
            let dataUpdate = { login_attempts: nuevoIntento };

            if (nuevoIntento >= 3) {
                const tiempoBloqueo = new Date(Date.now() + 15 * 60 * 1000); 
                
                dataUpdate.lock_until = tiempoBloqueo;
                dataUpdate.login_attempts = 0; 
                
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

        await userRepository.update(user.id, { login_attempts: 0, lock_until: null });

        const token = jwt.sign(
            { id: user.id, role_id: user.role_id, email: user.email },
            process.env.JWT_SECRET || 'secret_token_key_unal',
            { expiresIn: '4h' }
        );

        return { token, user };
    }
}

module.exports = new AuthService();