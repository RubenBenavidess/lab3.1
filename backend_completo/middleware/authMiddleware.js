const jwt = require('jsonwebtoken');

// Middleware que protege rutas usando JWT
function authMiddleware(req, res, next) {
  // Extrae el token del header Authorization
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: 'No autorizado' });

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Almacena el ID del usuario autenticado en la petición
    next(); // Continúa con la siguiente función
  } catch {
    return res.status(403).json({ msg: 'Token inválido' });
  }
}

module.exports = authMiddleware;