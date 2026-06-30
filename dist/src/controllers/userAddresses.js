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
function getAllUserAddresses(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM direccion_usuarios', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo direcciones:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getUserAddressById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('SELECT * FROM direccion_usuarios WHERE id = ?', [id]);
            const address = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!address) {
                return res.status(404).json({ error: 'Dirección no encontrada' });
            }
            return res.json(address);
        }
        catch (error) {
            console.error('Error obteniendo dirección:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createUserAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.usuario_id || !data.direccion || !data.ciudad || !data.departamento || !data.pais) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        try {
            const result = yield db_1.default.query(`INSERT INTO direccion_usuarios
            (usuario_id, direccion, barrio, ciudad, departamento, pais)
            VALUES (?, ?, ?, ?, ?, ?)`, [
                data.usuario_id,
                data.direccion,
                data.barrio,
                data.ciudad,
                data.departamento,
                data.pais
            ]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando dirección:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateUserAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            let fields = [];
            let values = [];
            if (data.usuario_id !== undefined) {
                fields.push('usuario_id = ?');
                values.push(data.usuario_id);
            }
            if (data.direccion !== undefined) {
                fields.push('direccion = ?');
                values.push(data.direccion);
            }
            if (data.barrio !== undefined) {
                fields.push('barrio = ?');
                values.push(data.barrio);
            }
            if (data.ciudad !== undefined) {
                fields.push('ciudad = ?');
                values.push(data.ciudad);
            }
            if (data.departamento !== undefined) {
                fields.push('departamento = ?');
                values.push(data.departamento);
            }
            if (data.pais !== undefined) {
                fields.push('pais = ?');
                values.push(data.pais);
            }
            if (fields.length === 0) {
                return res.status(400).json({ error: 'No hay campos para actualizar' });
            }
            const query = `UPDATE direccion_usuarios SET ${fields.join(', ')} WHERE id = ?`;
            values.push(id);
            const result = yield db_1.default.query(query, values);
            if (!result) {
                return res.status(404).json({ error: 'Dirección no encontrada' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando dirección:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteUserAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM direccion_usuarios WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Dirección no encontrada' });
            }
            return res.json({ message: 'Dirección eliminada correctamente' });
        }
        catch (error) {
            console.error('Error eliminando dirección:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllUserAddresses,
    getUserAddressById,
    createUserAddress,
    updateUserAddress,
    deleteUserAddress,
};
