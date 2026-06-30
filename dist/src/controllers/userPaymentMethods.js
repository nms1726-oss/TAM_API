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
function getAllUserPaymentMethods(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM metodo_pago_usuarios', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo métodos de pago:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getUserPaymentMethodById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('SELECT * FROM metodo_pago_usuarios WHERE id = ?', [id]);
            const paymentMethod = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!paymentMethod) {
                return res.status(404).json({ error: 'Método de pago no encontrado' });
            }
            return res.json(paymentMethod);
        }
        catch (error) {
            console.error('Error obteniendo método de pago:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createUserPaymentMethod(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.usuario_id || !data.tipo || !data.numero_parcial || !data.titular || !data.fecha_expiracion) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        try {
            const result = yield db_1.default.query(`INSERT INTO metodo_pago_usuarios
            (usuario_id, tipo, numero_parcial, titular, fecha_expiracion)
            VALUES (?, ?, ?, ?, ?)`, [
                data.usuario_id,
                data.tipo,
                data.numero_parcial,
                data.titular,
                data.fecha_expiracion
            ]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando método de pago:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateUserPaymentMethod(req, res) {
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
            if (data.tipo !== undefined) {
                fields.push('tipo = ?');
                values.push(data.tipo);
            }
            if (data.numero_parcial !== undefined) {
                fields.push('numero_parcial = ?');
                values.push(data.numero_parcial);
            }
            if (data.titular !== undefined) {
                fields.push('titular = ?');
                values.push(data.titular);
            }
            if (data.fecha_expiracion !== undefined) {
                fields.push('fecha_expiracion = ?');
                values.push(data.fecha_expiracion);
            }
            if (fields.length === 0) {
                return res.status(400).json({ error: 'No hay campos para actualizar' });
            }
            const query = `UPDATE metodo_pago_usuarios SET ${fields.join(', ')} WHERE id = ?`;
            values.push(id);
            const result = yield db_1.default.query(query, values);
            if (!result) {
                return res.status(404).json({ error: 'Método de pago no encontrado' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando método de pago:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteUserPaymentMethod(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM metodo_pago_usuarios WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Método de pago no encontrado' });
            }
            return res.json({ message: 'Método de pago eliminado correctamente' });
        }
        catch (error) {
            console.error('Error eliminando método de pago:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllUserPaymentMethods,
    getUserPaymentMethodById,
    createUserPaymentMethod,
    updateUserPaymentMethod,
    deleteUserPaymentMethod,
};
