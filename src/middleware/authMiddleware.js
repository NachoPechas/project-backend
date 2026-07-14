const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_token_key_unal';
const DEBUG = true;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (DEBUG) {
    console.log('[AuthMiddleware] Validando token para:', req.originalUrl);
    console.log('[AuthMiddleware] Headers recibidos:', {
      authorization: authHeader ? 'Bearer ***' : null,
      body: req.body ? { ...req.body, password: req.body?.password ? '***' : undefined } : null,
    });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (DEBUG) {
      console.log('[AuthMiddleware] Falló: no se envió token.');
    }
    return res.status(401).json({
      error: 'Acceso denegado. No se proporciono un token.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    if (DEBUG) {
      console.log('[AuthMiddleware] Token válido para usuario:', decoded.email);
    }
    next();
  } catch (error) {
    if (DEBUG) {
      console.log('[AuthMiddleware] Falló: token inválido o expirado.', error.message);
    }
    return res.status(403).json({
      error: 'Token invalido o expirado.',
    });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuario no autenticado.',
      });
    }

    const userRole = Number(req.user.roleId || req.user.role_id);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'No tienes permisos para realizar esta accion.',
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authorize,
};
