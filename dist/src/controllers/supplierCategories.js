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
function getAllSupplierCategories(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM proveedores_categorias', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo relaciones proveedor-categoría:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getSupplierCategoryById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const proveedor_id = parseInt(req.params.proveedor_id);
        const categoria_id = parseInt(req.params.categoria_id);
        try {
            const result = yield db_1.default.query('SELECT * FROM proveedores_categorias WHERE proveedor_id = ? AND categoria_id = ?', [proveedor_id, categoria_id]);
            const supplierCategory = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!supplierCategory) {
                return res.status(404).json({ error: 'Relación no encontrada' });
            }
            return res.json(supplierCategory);
        }
        catch (error) {
            console.error('Error obteniendo relación:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createSupplierCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.proveedor_id || !data.categoria_id) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        try {
            const result = yield db_1.default.query('INSERT INTO proveedores_categorias (proveedor_id, categoria_id) VALUES (?, ?)', [data.proveedor_id, data.categoria_id]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando relación:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateSupplierCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const proveedor_id = parseInt(req.params.proveedor_id);
        const categoria_id = parseInt(req.params.categoria_id);
        const data = req.body;
        try {
            const result = yield db_1.default.query(`UPDATE proveedores_categorias 
            SET proveedor_id = ?, categoria_id = ?
            WHERE proveedor_id = ? AND categoria_id = ?`, [
                data.proveedor_id,
                data.categoria_id,
                proveedor_id,
                categoria_id
            ]);
            if (!result) {
                return res.status(404).json({ error: 'Relación no encontrada' });
            }
            return res.json(Object.assign({}, data));
        }
        catch (error) {
            console.error('Error actualizando relación:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteSupplierCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const proveedor_id = parseInt(req.params.proveedor_id);
        const categoria_id = parseInt(req.params.categoria_id);
        try {
            const result = yield db_1.default.query('DELETE FROM proveedores_categorias WHERE proveedor_id = ? AND categoria_id = ?', [proveedor_id, categoria_id]);
            if (!result) {
                return res.status(404).json({ error: 'Relación no encontrada' });
            }
            return res.json({ message: 'Relación eliminada correctamente' });
        }
        catch (error) {
            console.error('Error eliminando relación:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllSupplierCategories,
    getSupplierCategoryById,
    createSupplierCategory,
    updateSupplierCategory,
    deleteSupplierCategory,
};
