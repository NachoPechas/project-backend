const authService = require('../services/authService');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo y la contraseña son obligatorios.'
                });
            }

            const { token, user } = await authService.login(email, password);

            return res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso.',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role_id: user.role_id
                }
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || 'Error en el servidor durante el inicio de sesión.'
            });
        }
    }
}

module.exports = new AuthController();