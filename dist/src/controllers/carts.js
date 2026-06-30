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
function getAllCarts(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM carritos', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo carritos:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getCartById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('SELECT * FROM carritos WHERE id = ?', [id]);
            const cart = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            return res.json(cart);
        }
        catch (error) {
            console.error('Error obteniendo el carrito:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { usuario_id, activo } = req.body;
        if (!usuario_id) {
            return res.status(400).json({ error: 'El campo usuario_id es obligatorio' });
        }
        try {
            const status = activo !== undefined ? activo : 1;
            const result = yield db_1.default.query('INSERT INTO carritos (usuario_id, activo) VALUES (?, ?)', [usuario_id, status]);
            return res.status(201).json({
                id: result,
                usuario_id,
                activo: status
            });
        }
        catch (error) {
            console.error('Error creando carrito:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const { usuario_id, activo } = req.body;
        try {
            const result = yield db_1.default.query('UPDATE carritos SET usuario_id = ?, activo = ? WHERE id = ?', [usuario_id, activo, id]);
            if (!result) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            return res.json({ id, usuario_id, activo });
        }
        catch (error) {
            console.error('Error actualizando carrito:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM carritos WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            return res.json({ message: 'Carrito eliminado correctamente' });
        }
        catch (error) {
            console.error('Error eliminando carrito:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllCarts,
    getCartById,
    createCart,
    updateCart,
    deleteCart,
};
