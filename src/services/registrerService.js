const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');

class RegistrerService {
    async registerStudent(userData) {
        const { name, email, password } = userData;

        if (!email || !email.trim().toLowerCase().endsWith('@unal.edu.co')) {
            const error = new Error('Registro denegado. Solo se permiten correos de la UNAL.');
            error.status = 400;
            throw error;
        }

        const existingUser = await userRepository.findByEmail(email.trim().toLowerCase());
        if (existingUser) {
            const error = new Error('El correo electrónico ya se encuentra registrado.');
            error.status = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudentData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role_id: 3,
            status: 'Activa',
            provider_auth: 'local'
        };

        try {
            return await userRepository.create(newStudentData);
        } catch (dbError) {
            console.error('[RegistrerService] DB Error:', dbError);
            const error = new Error('No se pudo completar el registro.');
            error.status = 500;
            throw error;
        }
    }
}

module.exports = new RegistrerService();