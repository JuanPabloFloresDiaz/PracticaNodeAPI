// responseStatus.js
// Este archivo contiene los códigos de estado y sus mensajes correspondientes para las respuestas de la API.
const responseStatus = {
    // 200: OK - La solicitud ha tenido éxito.
    OK: { code: 200, message: 'OK' },

    // 201: Created - La solicitud se ha cumplido y ha dado como resultado la creación de uno o más recursos nuevos.
    CREATED: { code: 201, message: 'Creado correctamente' },

    // 400: Bad Request - El servidor no pudo entender la solicitud debido a una sintaxis no válida.
    BAD_REQUEST: { code: 400, message: 'Solicitud inválida' },

    // 401: Unauthorized - La solicitud requiere autenticación.
    UNAUTHORIZED: { code: 401, message: 'No autorizado' },

    // 403: Forbidden - El servidor entiende la solicitud, pero se niega a cumplirla.
    FORBIDDEN: { code: 403, message: 'Acceso prohibido' },

    // 404: Not Found - El servidor no puede encontrar el recurso solicitado.
    NOT_FOUND: { code: 404, message: 'No encontrado' },

    // 500: Internal Server Error - El servidor ha encontrado una situación que no sabe cómo manejar.
    INTERNAL_SERVER_ERROR: { code: 500, message: 'Error interno del servidor' }
};

module.exports = responseStatus;