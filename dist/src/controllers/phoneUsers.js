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
function getAllphoneUsers(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM telefono_usuarios', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo usuarios de teléfono:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getphoneUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('SELECT * FROM telefono_usuarios WHERE id = ?', [id]);
            const phoneUser = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!phoneUser) {
                return res.status(404).json({ error: 'Usuario de teléfono no encontrado' });
            }
            return res.json(phoneUser);
        }
        catch (error) {
            console.error('Error obteniendo usuario de teléfono:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createphoneUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.usuario_id || !data.telefono) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        try {
            const result = yield db_1.default.query('INSERT INTO telefono_usuarios (usuario_id, telefono) VALUES (?, ?)', [
                data.usuario_id,
                data.telefono
            ]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando usuario de teléfono:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updatephoneUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            const result = yield db_1.default.query('UPDATE telefono_usuarios SET usuario_id = ?, telefono = ? WHERE usuario_id = ?', [data.usuario_id, data.telefono, id]);
            if (!result) {
                return res.status(404).json({ error: 'Usuario de teléfono no encontrado' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando usuario de teléfono:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deletephoneUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM telefono_usuarios WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Usuario de teléfono no encontrado' });
            }
            return res.json({ message: 'Usuario de teléfono eliminado correctamente' });
        }
        catch (error) {
            console.error('Error eliminando usuario de teléfono:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllphoneUsers,
    getphoneUserById,
    createphoneUser,
    updatephoneUser,
    deletephoneUser,
};
