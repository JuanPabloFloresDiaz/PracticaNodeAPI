
// Método para sanear todos los campos de un formulario.
const validateForm = (fields) => {
    if (Array.isArray(fields)) {
        // Si es un arreglo, aplicar trim directamente
        return fields.map(field => field.trim());
    } else if (typeof fields === 'object' && fields !== null) {
        // Si es un objeto, sanear sus valores
        const sanitized = {};
        for (const key in fields) {
            if (Object.hasOwn(fields, key)) {
                sanitized[key] = typeof fields[key] === 'string' ? fields[key].trim() : fields[key];
            }
        }
        return sanitized;
    } else {
        throw new Error('El formato de los campos no es válido.');
    }
}

// Validar el cuerpo de la petición
const validateBody = (req, res, next) => {
    try {
        console.log('Validando cuerpo:', req.body);
        req.body = validateForm(req.body);
        console.log('Cuerpo validado:', req.body);
        next();
    } catch (err) {
        res.status(400).json({ status: 0, error: err.message });
    }
};


// Validar cuerpo de acciones
const validateAction = (validActions) => (req, res, next) => {
    const { action } = req.query;

    // Verificar si `action` está definido
    if (!action) {
        return res.status(400).json({
            status: 0,
            error: 'El parámetro "action" es requerido.',
        });
    }

    // Verificar si `action` está dentro de las acciones válidas
    if (!validActions.includes(action)) {
        return res.status(400).json({
            status: 0,
            error: `La acción "${action}" no es válida. Acciones permitidas: ${validActions.join(', ')}.`,
        });
    }

    // Si pasa la validación, continuar con el siguiente middleware
    next();
};

module.exports = { validateBody, validateAction };
