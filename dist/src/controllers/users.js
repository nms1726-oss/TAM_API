"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
const helper_1 = require("../config/helper");
function getAllUsers(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM usuarios', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo los usuarios:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('SELECT * FROM usuarios WHERE id = ?', [id]);
            const user = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            return res.json(user);
        }
        catch (error) {
            console.error('Error obteniendo el usuario:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const data = req.body;
        if (!data.email || !data.password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: email y password' });
        }
        try {
            const result = yield db_1.default.query(`INSERT INTO usuarios
            (nombre_completo, tipo_documento, identificacion, fecha_nacimiento, email, password, verificado, token_verificacion, user_name, foto_perfil, rol_id, estado, fecha_ultimo_intento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                data.nombre_completo,
                data.tipo_documento,
                data.identificacion,
                data.fecha_nacimiento,
                data.email,
                data.password,
                (_a = data.verificado) !== null && _a !== void 0 ? _a : 1,
                (_b = data.token_verificacion) !== null && _b !== void 0 ? _b : null,
                data.user_name,
                (_c = data.foto_perfil) !== null && _c !== void 0 ? _c : null,
                data.rol_id,
                (_d = data.estado) !== null && _d !== void 0 ? _d : 1,
                (_e = data.fecha_ultimo_intento) !== null && _e !== void 0 ? _e : null
            ]);
            // Guardar teléfono
            if (data.telefono) {
                yield db_1.default.query(`INSERT INTO telefono_usuarios (usuario_id, telefono)
                 VALUES (?, ?)`, [
                    result.insertId,
                    data.telefono
                ]);
            }
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando el usuario:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            let campos = [];
            let valores = [];
            if (data.nombre_completo !== undefined) {
                campos.push("nombre_completo = ?");
                valores.push(data.nombre_completo);
            }
            if (data.tipo_documento !== undefined) {
                campos.push("tipo_documento = ?");
                valores.push(data.tipo_documento);
            }
            if (data.identificacion !== undefined) {
                campos.push("identificacion = ?");
                valores.push(data.identificacion);
            }
            if (data.fecha_nacimiento !== undefined) {
                campos.push("fecha_nacimiento = ?");
                valores.push(data.fecha_nacimiento);
            }
            if (data.email !== undefined) {
                campos.push("email = ?");
                valores.push(data.email);
            }
            if (data.password !== undefined) {
                campos.push("password = ?");
                valores.push(data.password);
            }
            if (data.user_name !== undefined) {
                campos.push("user_name = ?");
                valores.push(data.user_name);
            }
            // ESTE FALTABA
            if (data.rol_id !== undefined) {
                campos.push("rol_id = ?");
                valores.push(data.rol_id);
            }
            if (data.estado !== undefined) {
                campos.push("estado = ?");
                valores.push(data.estado);
            }
            if (data.fecha_ultimo_intento !== undefined) {
                campos.push("fecha_ultimo_intento = ?");
                valores.push(data.fecha_ultimo_intento);
            }
            if (campos.length === 0) {
                return res.status(400).json({
                    error: "No hay campos para actualizar"
                });
            }
            valores.push(id);
            const query = `
            UPDATE usuarios
            SET ${campos.join(", ")}
            WHERE id = ?
        `;
            yield db_1.default.query(query, valores);
            if (data.telefono !== undefined) {
                yield db_1.default.query(`UPDATE telefono_usuarios
                 SET telefono = ?
                 WHERE usuario_id = ?`, [
                    data.telefono,
                    id
                ]);
            }
            return res.json({
                message: "Usuario actualizado correctamente"
            });
        }
        catch (error) {
            console.error('Error actualizando el usuario:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM usuarios WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            return res.json({ message: 'Usuario eliminado correctamente' });
        }
        catch (error) {
            console.error('Error eliminando el usuario:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function checkUsername(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_name } = req.query;
        if (!user_name) {
            return res.status(400).json({ error: 'El parámetro user_name es obligatorio' });
        }
        try {
            const result = yield db_1.default.query('SELECT id FROM usuarios WHERE user_name = ?', [user_name]);
            const existe = Array.isArray(result) && result.length > 0;
            return res.json({ disponible: !existe });
        }
        catch (error) {
            console.error('Error verificando username:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function uploadProfilePhoto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No se recibió ningún archivo' });
        }
        try {
            const rutaRelativa = `uploads/perfiles/${file.filename}`;
            yield db_1.default.query('UPDATE usuarios SET foto_perfil = ? WHERE id = ?', [rutaRelativa, id]);
            return res.json({ message: 'Foto actualizada correctamente', foto_perfil: rutaRelativa });
        }
        catch (error) {
            console.error('Error subiendo foto de perfil:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    checkUsername,
    uploadProfilePhoto
};
