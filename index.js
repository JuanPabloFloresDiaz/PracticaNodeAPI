const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const usuariosRouter = require('./src/routes/public/usuarios_router');
const { validateBody } = require('./src/middleware/petitions');

const app = express();
const PORT = 3000;

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
app.use('/api', usuariosRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});