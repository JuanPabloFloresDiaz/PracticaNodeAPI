const express = require('express');
const UsuariosController = require('../../controllers/private/usuarios_controller');
const { validateCreateUser, validateUpdateUser, validateResult } = require('../../validators/usuarios_validator');
const { verifyJWT } = require('../../middleware/jwt');

const router = express.Router();

router.get('/private/usuario', verifyJWT, UsuariosController.getUser);
router.post('/private/usuarios', verifyJWT, validateCreateUser, validateResult, UsuariosController.createUser);
router.get('/private/usuarios', verifyJWT, UsuariosController.getAllUsers);
router.get('/private/usuarios/:id', verifyJWT, UsuariosController.getUserById);
router.put('/private/usuarios/:id', verifyJWT, validateUpdateUser, validateResult, UsuariosController.updateUser);
router.patch('/private/usuarios/:id/state', verifyJWT, UsuariosController.updateUserState);
router.delete('/private/usuarios/:id', verifyJWT, UsuariosController.deleteUser);

module.exports = router;