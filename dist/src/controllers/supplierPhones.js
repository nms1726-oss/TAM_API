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
function getAllSupplierPhones(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM telefono_proveedores', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo teléfonos:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getSupplierPhoneById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('SELECT * FROM telefono_proveedores WHERE id = ?', [id]);
            const supplierPhone = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!supplierPhone) {
                return res.status(404).json({ error: 'Teléfono no encontrado' });
            }
            return res.json(supplierPhone);
        }
        catch (error) {
            console.error('Error obteniendo teléfono:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createSupplierPhone(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.proveedor_id || !data.telefono) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        try {
            const result = yield db_1.default.query('INSERT INTO telefono_proveedores (proveedor_id, telefono) VALUES (?, ?)', [data.proveedor_id, data.telefono]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando teléfono:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateSupplierPhone(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            const result = yield db_1.default.query('UPDATE telefono_proveedores SET proveedor_id = ?, telefono = ? WHERE id = ?', [data.proveedor_id, data.telefono, id]);
            if (!result) {
                return res.status(404).json({ error: 'Teléfono no encontrado' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando teléfono:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteSupplierPhone(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM telefono_proveedores WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Teléfono no encontrado' });
            }
            return res.json({ message: 'Teléfono eliminado correctamente' });
        }
        catch (error) {
            console.error('Error eliminando teléfono:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllSupplierPhones,
    getSupplierPhoneById,
    createSupplierPhone,
    updateSupplierPhone,
    deleteSupplierPhone,
};
