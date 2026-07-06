const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_para_la_biblioteca_123';

// 1. Middleware Base: Verifica que el usuario esté logueado con un token válido
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

// 2. Middleware Especializado: Solo permite el paso a Estudiantes (role_id: 3)
const isStudent = (req, res, next) => {
  if (req.user && req.user.roleId === 3) {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de Estudiante.' });
  }
};

// 3. Middleware Especializado: Permite el paso a Bibliotecarios (2) o Administradores (1)
const isLibraryStaff = (req, res, next) => {
  if (req.user && (req.user.roleId === 2 || req.user.roleId === 1)) {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de Bibliotecario o Administrador.' });
  }
};

module.exports = {
  verifyToken,
  isStudent,
  isLibraryStaff
};