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
function getAllComparisonHistories(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM historial_comparaciones', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo historial:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getComparisonHistoryById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('SELECT * FROM historial_comparaciones WHERE id = ?', [id]);
            const history = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!history) {
                return res.status(404).json({ error: 'Historial no encontrado' });
            }
            return res.json(history);
        }
        catch (error) {
            console.error('Error obteniendo historial:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createComparisonHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.detalle_comparacion || !data.producto_id_1 || !data.producto_id_2 || !data.usuario_id) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        try {
            const result = yield db_1.default.query(`INSERT INTO historial_comparaciones
            (fecha, detalle_comparacion, producto_id_1, producto_id_2, producto_id_3, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?)`, [
                data.detalle_comparacion,
                data.producto_id_1,
                data.producto_id_2,
                data.producto_id_3,
                data.usuario_id
            ]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando historial:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateComparisonHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            let fields = [];
            let values = [];
            if (data.detalle_comparacion !== undefined) {
                fields.push('detalle_comparacion = ?');
                values.push(data.detalle_comparacion);
            }
            if (data.producto_id_1 !== undefined) {
                fields.push('producto_id_1 = ?');
                values.push(data.producto_id_1);
            }
            if (data.producto_id_2 !== undefined) {
                fields.push('producto_id_2 = ?');
                values.push(data.producto_id_2);
            }
            if (data.producto_id_3 !== undefined) {
                fields.push('producto_id_3 = ?');
                values.push(data.producto_id_3);
            }
            if (data.usuario_id !== undefined) {
                fields.push('usuario_id = ?');
                values.push(data.usuario_id);
            }
            if (fields.length === 0) {
                return res.status(400).json({ error: 'No hay campos para actualizar' });
            }
            const query = `UPDATE historial_comparaciones SET ${fields.join(', ')} WHERE id = ?`;
            values.push(id);
            const result = yield db_1.default.query(query, values);
            if (!result) {
                return res.status(404).json({ error: 'Historial no encontrado' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando historial:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteComparisonHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM historial_comparaciones WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Historial no encontrado' });
            }
            return res.json({ message: 'Historial eliminado correctamente' });
        }
        catch (error) {
            console.error('Error eliminando historial:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllComparisonHistories,
    getComparisonHistoryById,
    createComparisonHistory,
    updateComparisonHistory,
    deleteComparisonHistory,
};
