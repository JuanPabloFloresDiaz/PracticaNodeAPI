const UsuarioModel = require('../../models/usuarios_models');
const { validateCreateUser, validateUpdateUser, validateResult } = require('../../validators/usuarios_validator');
const responseStatus = require('../../config/responseStatus');
const messages = require('../../config/messages');
const createResult = require('../../config/result');

class UsuariosController {
    // Método para crear un nuevo usuario
    static async createUser(req, res) {
        try {
            const { nombre, correo, clave, telefono, dui, direccion, nacimiento } = req.body;
            const usuario = new UsuarioModel(null, nombre, correo, clave, telefono, dui, nacimiento, null, direccion);
            const result = await usuario.createUser();

            res.status(responseStatus.CREATED.code).json(
                createResult({
                    status: responseStatus.CREATED.code,
                    message: messages.success.create('Usuario'),
                    dataset: result
                })
            );
        } catch (error) {
            res.status(responseStatus.INTERNAL_SERVER_ERROR.code).json(
                createResult({
                    status: responseStatus.INTERNAL_SERVER_ERROR.code,
                    message: messages.error.create('usuario'),
                    error: error.message
                })
            );
        }
    }

    // Método para obtener todos los usuarios
    static async getAllUsers(req, res) {
        try {
            const usuario = new UsuarioModel();
            const result = await usuario.readAll();
            res.status(responseStatus.OK.code).json(
                createResult({
                    status: responseStatus.OK.code,
                    message: messages.success.readAll(result.length),
                    dataset: result
                })
            );
        } catch (error) {
            res.status(responseStatus.INTERNAL_SERVER_ERROR.code).json(
                createResult({
                    status: responseStatus.INTERNAL_SERVER_ERROR.code,
                    message: messages.error.server,
                    error: error.message
                })
            );
        }
    }

    // Método para obtener un usuario por ID
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const usuario = new UsuarioModel(id);
            const result = await usuario.readOne();
            if (result) {
                res.status(responseStatus.OK.code).json(
                    createResult({
                        status: responseStatus.OK.code,
                        message: messages.success.search(1),
                        dataset: result
                    })
                );
            } else {
                res.status(responseStatus.NOT_FOUND.code).json(
                    createResult({
                        status: responseStatus.NOT_FOUND.code,
                        message: messages.error.readOne('Usuario')
                    })
                );
            }
        } catch (error) {
            res.status(responseStatus.INTERNAL_SERVER_ERROR.code).json(
                createResult({
                    status: responseStatus.INTERNAL_SERVER_ERROR.code,
                    message: messages.error.server,
                    error: error.message
                })
            );
        }
    }

    // Método para actualizar un usuario
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { nombre, correo, telefono, dui, direccion, nacimiento, estado } = req.body;
            const usuario = new UsuarioModel(id, nombre, correo, null, telefono, dui, nacimiento, estado, direccion);
            const result = await usuario.updateRow();
            res.status(responseStatus.OK.code).json(
                createResult({
                    status: responseStatus.OK.code,
                    message: messages.success.update('Usuario'),
                    dataset: result
                })
            );
        } catch (error) {
            res.status(responseStatus.INTERNAL_SERVER_ERROR.code).json(
                createResult({
                    status: responseStatus.INTERNAL_SERVER_ERROR.code,
                    message: messages.error.update('usuario'),
                    error: error.message
                })
            );
        }
    }

    // Método para actualizar el estado de un usuario
    static async updateUserState(req, res) {
        try {
            const { id } = req.params;
            const usuario = new UsuarioModel(id);
            const result = await usuario.updateState();
            res.status(responseStatus.OK.code).json(
                createResult({
                    status: responseStatus.OK.code,
                    message: messages.success.state('Usuario'),
                    dataset: result
                })
            );
        } catch (error) {
            res.status(responseStatus.INTERNAL_SERVER_ERROR.code).json(
                createResult({
                    status: responseStatus.INTERNAL_SERVER_ERROR.code,
                    message: messages.error.state('usuario'),
                    error: error.message
                })
            );
        }
    }

    // Método para eliminar un usuario
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const usuario = new UsuarioModel(id);
            const result = await usuario.deleteRow();
            res.status(responseStatus.OK.code).json(
                createResult({
                    status: responseStatus.OK.code,
                    message: messages.success.delete('Usuario'),
                    dataset: result
                })
            );
        } catch (error) {
            res.status(responseStatus.INTERNAL_SERVER_ERROR.code).json(
                createResult({
                    status: responseStatus.INTERNAL_SERVER_ERROR.code,
                    message: messages.error.delete('usuario'),
                    error: error.message
                })
            );
        }
    }
}

module.exports = UsuariosController;