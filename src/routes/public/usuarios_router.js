const express = require('express');
const router = express.Router();
const UsuariosController = require('../../controllers/public/usuarios_controller');
const { validateCreateUser, validateUpdateUser, validateResult } = require('../../validators/usuarios_validator');

router.post('/usuarios', validateCreateUser, validateResult, UsuariosController.createUser);
router.get('/usuarios', UsuariosController.getAllUsers);
router.get('/usuarios/:id', UsuariosController.getUserById);
router.put('/usuarios/:id', validateUpdateUser, validateResult, UsuariosController.updateUser);
router.patch('/usuarios/:id/state', UsuariosController.updateUserState);
router.delete('/usuarios/:id', UsuariosController.deleteUser);

module.exports = router;