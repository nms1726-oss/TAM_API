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
function getAllCartDetails(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM detalle_carrito', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo detalles del carrito:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getCartDetailById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('SELECT * FROM detalle_carrito WHERE id = ?', [id]);
            const detail = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!detail) {
                return res.status(404).json({ error: 'Detalle del carrito no encontrado' });
            }
            return res.json(detail);
        }
        catch (error) {
            console.error('Error obteniendo detalle del carrito:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createCartDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { carrito_id, producto_id, cantidad, subtotal } = req.body;
        if (!carrito_id || !producto_id || cantidad === undefined) {
            return res.status(400).json({ error: 'Los campos carrito_id, producto_id y cantidad son obligatorios' });
        }
        try {
            const result = yield db_1.default.query(`INSERT INTO detalle_carrito 
            (carrito_id, producto_id, cantidad, subtotal) 
            VALUES (?, ?, ?, ?)`, [carrito_id, producto_id, cantidad, subtotal || null]);
            return res.status(201).json({
                id: result,
                carrito_id,
                producto_id,
                cantidad,
                subtotal
            });
        }
        catch (error) {
            console.error('Error creando detalle del carrito:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateCartDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            let fields = [];
            let values = [];
            if (data.carrito_id !== undefined) {
                fields.push('carrito_id = ?');
                values.push(data.carrito_id);
            }
            if (data.producto_id !== undefined) {
                fields.push('producto_id = ?');
                values.push(data.producto_id);
            }
            if (data.cantidad !== undefined) {
                fields.push('cantidad = ?');
                values.push(data.cantidad);
            }
            if (data.subtotal !== undefined) {
                fields.push('subtotal = ?');
                values.push(data.subtotal);
            }
            if (fields.length === 0) {
                return res.status(400).json({ error: 'No hay campos para actualizar' });
            }
            const query = `UPDATE detalle_carrito SET ${fields.join(', ')} WHERE id = ?`;
            values.push(id);
            const result = yield db_1.default.query(query, values);
            if (!result) {
                return res.status(404).json({ error: 'Detalle del carrito no encontrado' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando detalle del carrito:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteCartDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM detalle_carrito WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Detalle del carrito no encontrado' });
            }
            return res.json({ message: 'Detalle del carrito eliminado correctamente' });
        }
        catch (error) {
            console.error('Error eliminando detalle del carrito:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllCartDetails,
    getCartDetailById,
    createCartDetail,
    updateCartDetail,
    deleteCartDetail,
};
