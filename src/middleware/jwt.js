// Cargar variables de entorno desde un archivo .env
const properties = require('../config/properties');
const jwt = require('jsonwebtoken');

const secretKey = properties.CLAVE_JWT;

// Función para generar un JWT
const generateJWT = (userData) => {
  const options = { expiresIn: '1h' };
  return jwt.sign(userData, secretKey, options);
};

// Middleware para verificar un JWT en las solicitudes de Express
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Leer el encabezado Authorization
  if (!authHeader) {
    return res.status(403).json({
      status: 0,
      message: 'Token no proporcionado',
      dataset: null,
      error: 'El token no fue proporcionado',
      exception: null,
    });
  }

  // Extraer el token sin el prefijo 'Bearer '
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({
      status: 0,
      message: 'Token no proporcionado o malformado',
      dataset: null,
      error: 'El token no fue proporcionado correctamente',
      exception: null,
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Verificar token puro
    req.user = decoded; // Agregar el usuario decodificado a la solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};


// Función para validar un JWT directamente (opcional)
const validateJWT = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null; // Devuelve null si no hay encabezado o si está mal formado
  }

  // Extraer el token sin el prefijo 'Bearer '
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, secretKey); // Verifica el token puro
  } catch (error) {
    return null; // Devuelve null si la verificación falla
  }
};


module.exports = { generateJWT, verifyJWT, validateJWT };
