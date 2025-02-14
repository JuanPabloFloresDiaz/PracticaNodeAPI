const db = require('../config/database');
const { generateJWT, verifyJWT, validateJWT } = require('../middleware/jwt');
const TABLES = require('../config/tables');
const bcrypt = require('bcrypt');

class UsuarioModel {
    // Constructor con cada una de las variables que se instanciarían
    constructor(
        // Tabla: usuarios
        id = null,
        nombre = null,
        correo = null,
        clave = null,
        telefono = null,
        dui = null,
        nacimiento = null,
        estado = null,
        direccion = null,
        // Extras
        condicion = null
    ) {
        // Tabla: usuarios
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.clave = clave;
        this.telefono = telefono;
        this.dui = dui;
        this.nacimiento = nacimiento;
        this.estado = estado;
        this.direccion = direccion;
        // Extras
        this.condicion = condicion;
    }

    // Constantes para vistas y procedimientos
    static VISTA_USUARIOS = 'vista_tabla_usuarios';
    static PROC_INSERTAR_USUARIO = 'insertar_usuario';
    static PROC_ACTUALIZAR_USUARIO = 'actualizar_usuario';
    static PROC_ACTUALIZAR_ESTADO_USUARIO = 'actualizar_estado_usuario';
    static PROC_ELIMINAR_USUARIO = 'eliminar_usuario';

    // Metodo para el LOGIN
    async Login(email, password) {
        const sql = `SELECT ${TABLES.usuarios.ID} , ${TABLES.usuarios.CORREO} , ${TABLES.usuarios.DUI} , ${TABLES.usuarios.CLAVE} 
        FROM ${UsuarioModel.VISTA_USUARIOS} WHERE ${TABLES.usuarios.CORREO} = ?`;
        const params = [email];
        const row = await db.getRow(sql, params);
        // Verificar si el usuario existe
        if (!row) {
            return false; // Usuario no encontrado
        }

        // Comparar la contraseña usando bcrypt
        const isMatch = await bcrypt.compare(password, row.CLAVE);

        if (isMatch) {
            // Generar un JWT con los datos del usuario
            const userData = {
                id: row.ID,
                correo: row.CORREO,
                nombre: row.NOMBRE,
                dui: row.DUI,
            };
            const token = generateJWT(userData);
            return token;
        } else {
            return false;
        }
    }

    // Métodos CRUD y funcionalidades relacionadas
    // Método para crear un usuario
    async createUser() {
        const procedureName = UsuarioModel.PROC_INSERTAR_USUARIO;
        const params = [this.nombre, this.correo, this.clave, this.telefono, this.dui, this.direccion, this.nacimiento];
        return await db.executeProcedure(procedureName, params);
    }

    // Método para obtener todos los usuarios
    async readAll() {
        const sql = `SELECT * FROM ${UsuarioModel.VISTA_USUARIOS} ORDER BY ${TABLES.usuarios.NOMBRE};`;
        return await db.getRows(sql);
    }

    // Método para obtener un usuario por ID
    async readOne() {
        const sql = `SELECT * FROM ${UsuarioModel.VISTA_USUARIOS} WHERE ${TABLES.usuarios.ID} = ?;`;
        const params = [this.id];
        return await db.getRow(sql, params);
    }

    // Método para actualizar un usuario
    async updateRow() {
        const procedureName = UsuarioModel.PROC_ACTUALIZAR_USUARIO;
        const params = [this.id, this.nombre, this.correo, this.telefono, this.dui, this.direccion, this.nacimiento, this.estado];
        return await db.executeProcedure(procedureName, params);
    }

    // Método para actualizar el estado de un usuario
    async updateState() {
        const procedureName = UsuarioModel.PROC_ACTUALIZAR_ESTADO_USUARIO;
        const params = [this.id];
        return await db.executeProcedure(procedureName, params);
    }

    // Método para eliminar un usuario
    async deleteRow() {
        const procedureName = UsuarioModel.PROC_ELIMINAR_USUARIO;
        const params = [this.id];
        return await db.executeProcedure(procedureName, params);
    }
}

module.exports = UsuarioModel;
