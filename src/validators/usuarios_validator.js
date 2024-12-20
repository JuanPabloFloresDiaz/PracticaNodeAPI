const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const responseStatus = require('../config/responseStatus');

const validatePassword = (value, { req }) => {
    if (value.length < 8) {
        throw new Error('Clave menor a 8 caracteres');
    } else if (value.length > 72) {
        throw new Error('Clave mayor a 72 caracteres');
    } else if (/\s/.test(value)) {
        throw new Error('Clave contiene espacios en blanco');
    } else if (!/\W/.test(value)) {
        throw new Error('Clave debe contener al menos un caracter especial');
    } else if (!/\d/.test(value)) {
        throw new Error('Clave debe contener al menos un dígito');
    } else if (!/[a-z]/.test(value)) {
        throw new Error('Clave debe contener al menos una letra en minúsculas');
    } else if (!/[A-Z]/.test(value)) {
        throw new Error('Clave debe contener al menos una letra en mayúsculas');
    }

    const sensitiveData = {
        'nombre': req.body.nombre,
        'correo': req.body.correo,
        'nacimiento': req.body.nacimiento,
    };

    const valueLower = value.toLowerCase();
    for (const [label, data] of Object.entries(sensitiveData)) {
        if (data) {
            const dataLower = data.toLowerCase();
            for (let i = 0; i <= dataLower.length - 3; i++) {
                const substring = dataLower.substring(i, i + 3);
                if (valueLower.includes(substring)) {
                    throw new Error(`Clave contiene parte del ${label} del usuario: '${substring}'`);
                }
            }
        }
    }
    return true;
};

const validateCreateUser = [
    check('nombre').notEmpty().withMessage('El nombre es requerido'),
    check('correo').isEmail().withMessage('El correo no es válido'),
    check('clave').custom(validatePassword).withMessage('La clave no cumple con los requisitos'),
    check('telefono').isMobilePhone().withMessage('El teléfono no es válido'),
    check('dui').notEmpty().withMessage('El DUI es requerido'),
    check('direccion').notEmpty().withMessage('La dirección es requerida'),
    check('nacimiento').isDate().withMessage('La fecha de nacimiento no es válida'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(responseStatus.BAD_REQUEST.code).json({ errors: errors.array() });
        }
        // Encriptar la contraseña después de la validación
        try {
            const salt = await bcrypt.genSalt(10);
            req.body.clave = await bcrypt.hash(req.body.clave, salt);
            next();
        } catch (err) {
            return res.status(responseStatus.INTERNAL_SERVER_ERROR.code).json({ error: 'Error al encriptar la clave' });
        }
    }
];

const validateUpdateUser = [
    check('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    check('correo').optional().isEmail().withMessage('El correo no es válido'),
    check('telefono').optional().isMobilePhone().withMessage('El teléfono no es válido'),
    check('dui').optional().notEmpty().withMessage('El DUI no puede estar vacío'),
    check('direccion').optional().notEmpty().withMessage('La dirección no puede estar vacía'),
    check('nacimiento').optional().isDate().withMessage('La fecha de nacimiento no es válida'),
    check('estado').optional().isBoolean().withMessage('El estado debe ser un valor booleano'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(responseStatus.BAD_REQUEST.code).json({ errors: errors.array() });
        }
        // Encriptar la contraseña si está presente en la actualización
        if (req.body.clave) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.clave = await bcrypt.hash(req.body.clave, salt);
            } catch (err) {
                return res.status(responseStatus.INTERNAL_SERVER_ERROR.code).json({ error: 'Error al encriptar la clave' });
            }
        }
        next();
    }
];

const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(responseStatus.BAD_REQUEST.code).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateCreateUser, validateUpdateUser, validateResult };