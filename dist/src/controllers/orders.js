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
function getAllOrders(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query(`SELECT
                p.*,
                u.nombre_completo,
                u.identificacion
            FROM pedidos p
            INNER JOIN usuarios u
                ON p.usuario_id = u.id`, []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo pedidos:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getOrderById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query(`SELECT
                p.*,
                u.nombre_completo,
                u.identificacion
            FROM pedidos p
            INNER JOIN usuarios u
                ON p.usuario_id = u.id
            WHERE p.id = ?`, [id]);
            const order = Array.isArray(result) && result.length > 0
                ? result[0]
                : undefined;
            if (!order) {
                return res.status(404).json({
                    error: 'Pedido no encontrado'
                });
            }
            return res.json(order);
        }
        catch (error) {
            console.error('Error obteniendo pedido:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
function createOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.cod_factura || !data.valor || !data.usuario_id) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        try {
            const result = yield db_1.default.query(`INSERT INTO pedidos 
            (cod_factura, canal_venta, valor, estado, usuario_id) 
            VALUES (?, ?, ?, ?, ?)`, [
                data.cod_factura,
                data.canal_venta,
                data.valor,
                data.estado || 'pendiente',
                data.usuario_id
            ]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando pedido:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            let fields = [];
            let values = [];
            if (data.cod_factura !== undefined) {
                fields.push('cod_factura = ?');
                values.push(data.cod_factura);
            }
            if (data.canal_venta !== undefined) {
                fields.push('canal_venta = ?');
                values.push(data.canal_venta);
            }
            if (data.valor !== undefined) {
                fields.push('valor = ?');
                values.push(data.valor);
            }
            if (data.estado !== undefined) {
                fields.push('estado = ?');
                values.push(data.estado);
            }
            if (data.usuario_id !== undefined) {
                fields.push('usuario_id = ?');
                values.push(data.usuario_id);
            }
            if (fields.length === 0) {
                return res.status(400).json({ error: 'No hay campos para actualizar' });
            }
            const query = `UPDATE pedidos SET ${fields.join(', ')} WHERE id = ?`;
            values.push(id);
            const result = yield db_1.default.query(query, values);
            if (!result) {
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando pedido:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM pedidos WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }
            return res.json({ message: 'Pedido eliminado correctamente' });
        }
        catch (error) {
            console.error('Error eliminando pedido:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};
