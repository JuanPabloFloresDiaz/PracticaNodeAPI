const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { validateBody } = require('./src/middleware/petitions');
const fs = require('fs');
const path = require('path');
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
// Función para cargar dinámicamente las rutas
function cargarRutas(rutaBase) {
    fs.readdirSync(rutaBase).forEach(file => {
        const filePath = path.join(rutaBase, file);
        if (fs.statSync(filePath).isDirectory()) {
            cargarRutas(filePath);  // Recursión si encontramos subdirectorios
        } else if (file.endsWith('router.js')) {
            const ruta = require(filePath);
            const rutaPrefix = '/api/' + file.split('.')[0]; // Usamos el nombre del archivo como prefijo de ruta
            app.use(rutaPrefix, ruta);
            console.log(`Ruta cargada: ${rutaPrefix}`);
        }
    });
}

// Cargar las rutas de las carpetas src/routes
cargarRutas(path.join(__dirname, 'src/routes'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});