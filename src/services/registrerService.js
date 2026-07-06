const userRepository = require('../repositories/userRepository');

class UserService {
    async registerStudent(userData) {
        const { name, email } = userData;

        if (!email || !email.trim().toLowerCase().endsWith('@unal.edu.co')) {
            const error = new Error('Registro denegado. Solo se permiten correos institucionales (@unal.edu.co).');
            error.status = 400;
            throw error;
        }

        const existingUser = await userRepository.findByEmail(email.trim().toLowerCase());
        if (existingUser) {
            const error = new Error('El correo electrónico ya se encuentra registrado.');
            error.status = 409;
            throw error;
        }


        const newStudentData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            role_id: 3,
            status: 'Activo',
            provider_auth: 'local'
        };

        try {
            return await userRepository.create(newStudentData);
        } catch (dbError) {
            console.error('[UserService][registerStudent] DB Error:', dbError);
            const error = new Error('No se pudo completar el registro en este momento.');
            error.status = 500;
            throw error;
        }
    }
}

module.exports = new UserService();