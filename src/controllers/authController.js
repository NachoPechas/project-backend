const authService = require('../services/authService');
const auditService = require('../services/auditService');

class AuthController {
    async login(req, res) {
        console.log("📥 DATOS LLEGANDO DEL FRONTEND:", req.body);
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo y la contraseña son obligatorios.'
                });
            }

            const { token, user } = await authService.login(email, password);
            auditService.logAction({
                userId: user.id,
                action: 'LOGIN',
                entity: 'User',
                entityId: user.id,
                details: { email: user.email },
                ipAddress: req.ip
            }).catch(() => {});

            return res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso.',
                token,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    roleId: user.roleId
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
