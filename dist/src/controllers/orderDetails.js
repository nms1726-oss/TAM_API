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
function getAllOrderDetails(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query(`SELECT
                dp.*,
                p.nombre
            FROM detalle_pedido dp
            INNER JOIN productos p
                ON dp.producto_id = p.id`, []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo detalles:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
function getOrderDetailById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query(`SELECT
                dp.*,
                p.nombre
            FROM detalle_pedido dp
            INNER JOIN productos p
                ON dp.producto_id = p.id
            WHERE dp.id = ?`, [id]);
            const detail = Array.isArray(result) && result.length > 0
                ? result[0]
                : undefined;
            if (!detail) {
                return res.status(404).json({
                    error: 'Detalle no encontrado'
                });
            }
            return res.json(detail);
        }
        catch (error) {
            console.error('Error obteniendo detalle:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
function createOrderDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.cantidad || !data.iva_porcentaje || !data.pedido_id || !data.producto_id) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        try {
            const result = yield db_1.default.query(`INSERT INTO detalle_pedido 
            (cantidad, iva_porcentaje, pedido_id, producto_id) 
            VALUES (?, ?, ?, ?)`, [
                data.cantidad,
                data.iva_porcentaje,
                data.pedido_id,
                data.producto_id
            ]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando detalle:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateOrderDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            let fields = [];
            let values = [];
            if (data.cantidad !== undefined) {
                fields.push('cantidad = ?');
                values.push(data.cantidad);
            }
            if (data.iva_porcentaje !== undefined) {
                fields.push('iva_porcentaje = ?');
                values.push(data.iva_porcentaje);
            }
            if (data.pedido_id !== undefined) {
                fields.push('pedido_id = ?');
                values.push(data.pedido_id);
            }
            if (data.producto_id !== undefined) {
                fields.push('producto_id = ?');
                values.push(data.producto_id);
            }
            if (fields.length === 0) {
                return res.status(400).json({ error: 'No hay campos para actualizar' });
            }
            const query = `UPDATE detalle_pedido SET ${fields.join(', ')} WHERE id = ?`;
            values.push(id);
            const result = yield db_1.default.query(query, values);
            if (!result) {
                return res.status(404).json({ error: 'Detalle no encontrado' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando detalle:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteOrderDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM detalle_pedido WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Detalle no encontrado' });
            }
            return res.json({ message: 'Detalle eliminado correctamente' });
        }
        catch (error) {
            console.error('Error eliminando detalle:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllOrderDetails,
    getOrderDetailById,
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail,
};
