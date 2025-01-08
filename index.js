const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const usuariosRouterPublic = require('./src/routes/public/usuarios_router');
const usuariosRouterPrivate = require('./src/routes/private/usuarios_router');
const { validateBody } = require('./src/middleware/petitions');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Asegúrate de que este sea el origen correcto de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

const PORT = 4000;

// Configuración de multer para manejar form-data
const upload = multer();

// Middleware para parsear el cuerpo de las peticiones
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para manejar form-data
app.use(upload.none());

// Middleware para validar el cuerpo de las peticiones
app.use(validateBody);

// Rutas
app.use('/api', usuariosRouterPublic);
app.use('/api', usuariosRouterPrivate);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});