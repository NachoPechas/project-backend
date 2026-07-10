



const authorizeRole = (requiredRoleId) => {
    return (req, res, next) => {
        if (!req.user || req.user.role_id !== requiredRoleId) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren permisos de Bibliotecario.'
            });
        }
        next();
    };
};

module.exports = { authorizeRole };