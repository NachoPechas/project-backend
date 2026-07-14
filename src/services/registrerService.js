const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');

class RegistrerService {
    normalizeRole(roleValue) {
        if (roleValue === undefined || roleValue === null || roleValue === '') {
            return 3;
        }

        if (typeof roleValue === 'number') {
            return [1, 2, 3].includes(roleValue) ? roleValue : null;
        }

        if (typeof roleValue === 'string') {
            const trimmedValue = roleValue.trim().toLowerCase();
            if (['1', 'admin', 'administrador', 'rol1'].includes(trimmedValue)) return 1;
            if (['2', 'bibliotecario', 'rol2'].includes(trimmedValue)) return 2;
            if (['3', 'estudiante', 'student', 'rol3'].includes(trimmedValue)) return 3;

            const parsedValue = Number(trimmedValue);
            if (!Number.isNaN(parsedValue)) {
                return [1, 2, 3].includes(parsedValue) ? parsedValue : null;
            }
        }

        return null;
    }

    async registerStudent(userData) {
        const {
            nombre,
            email,
            password,
            confirmPassword,
            roleId,
            rol,
            currentUserRoleId
        } = userData;

        const errors = {};

        if (!nombre || !String(nombre).trim()) {
            errors.nombre = 'El nombre es obligatorio.';
        }

        if (!email || !String(email).trim()) {
            errors.email = 'El correo es obligatorio.';
        } else {
            const normalizedEmail = String(email).trim().toLowerCase();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
                errors.email = 'Ingresa un correo electrónico válido.';
            } else if (!normalizedEmail.endsWith('@unal.edu.co')) {
                errors.email = 'Solo se permiten correos institucionales de la UNAL.';
            }
        }

        if (!password) {
            errors.password = 'La contraseña es obligatoria.';
        } else if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
            errors.password = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.';
        }

        if (password && confirmPassword !== password) {
            errors.confirmPassword = 'La confirmación de contraseña no coincide.';
        }

        const normalizedRole = this.normalizeRole(roleId ?? rol ?? 3);
        if (normalizedRole === null) {
            errors.role = 'El rol seleccionado no es válido.';
        }

        if (!currentUserRoleId) {
            const error = new Error('Debes iniciar sesión para registrar usuarios.');
            error.status = 401;
            throw error;
        }

        if (normalizedRole !== 3 && Number(currentUserRoleId) !== 1) {
            const error = new Error('Solo un administrador puede crear usuarios con rol distinto a estudiante.');
            error.status = 403;
            throw error;
        }

        if (Object.keys(errors).length > 0) {
            const error = new Error('Los datos enviados no son válidos.');
            error.status = 400;
            error.errors = errors;
            throw error;
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const existingUser = await userRepository.findByEmail(normalizedEmail);
        if (existingUser) {
            const error = new Error('El correo electrónico ya se encuentra registrado.');
            error.status = 409;
            error.errors = { email: 'El correo electrónico ya se encuentra registrado.' };
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudentData = {
            nombre: String(nombre).trim(),
            email: normalizedEmail,
            password: hashedPassword,
            roleId: normalizedRole,
            status: 'Activo',
            providerAuth: 'local'
        };

        try {
            return await userRepository.create(newStudentData);
        } catch (dbError) {
            console.error('[RegistrerService] DB Error:', dbError);
            if (dbError?.name === 'SequelizeUniqueConstraintError' || dbError?.code === '23505') {
                const error = new Error('El correo electrónico ya se encuentra registrado.');
                error.status = 409;
                error.errors = { email: 'El correo electrónico ya se encuentra registrado.' };
                throw error;
            }

            const error = new Error('No se pudo completar el registro.');
            error.status = 500;
            throw error;
        }
    }
}

module.exports = new RegistrerService();
