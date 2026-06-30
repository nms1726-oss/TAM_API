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
function getAllActionControls(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query(`SELECT
                ca.*,
                u.nombre_completo,
                u.identificacion
            FROM control_acciones ca
            INNER JOIN usuarios u
                ON ca.usuario_id = u.id`, []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo acciones:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
function getActionControlById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query(`SELECT
                ca.*,
                u.nombre_completo,
                u.identificacion
            FROM control_acciones ca
            INNER JOIN usuarios u
                ON ca.usuario_id = u.id
            WHERE ca.id = ?`, [id]);
            const actionControl = Array.isArray(result) && result.length > 0
                ? result[0]
                : undefined;
            if (!actionControl) {
                return res.status(404).json({
                    error: 'Acción no encontrada'
                });
            }
            return res.json(actionControl);
        }
        catch (error) {
            console.error('Error obteniendo acción:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
function createActionControl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.usuario_id || !data.accion) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        try {
            const result = yield db_1.default.query('INSERT INTO control_acciones (usuario_id, accion, observaciones) VALUES (?, ?, ?)', [data.usuario_id, data.accion, data.observaciones]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando acción:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateActionControl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            const result = yield db_1.default.query('UPDATE control_acciones SET usuario_id = ?, accion = ?, observaciones = ? WHERE id = ?', [data.usuario_id, data.accion, data.observaciones, id]);
            if (!result) {
                return res.status(404).json({ error: 'Acción no encontrada' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando acción:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteActionControl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM control_acciones WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Acción no encontrada' });
            }
            return res.json({ message: 'Acción eliminada correctamente' });
        }
        catch (error) {
            console.error('Error eliminando acción:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllActionControls,
    getActionControlById,
    createActionControl,
    updateActionControl,
    deleteActionControl,
};
