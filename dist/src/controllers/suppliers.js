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
function getAllSuppliers(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM proveedores', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo proveedores:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getSupplierById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('SELECT * FROM proveedores WHERE id = ?', [id]);
            const supplier = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!supplier) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }
            return res.json(supplier);
        }
        catch (error) {
            console.error('Error obteniendo proveedor:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createSupplier(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.nombre) {
            return res.status(400).json({ error: 'Falta nombre' });
        }
        try {
            const result = yield db_1.default.query('INSERT INTO proveedores (nombre, correo) VALUES (?, ?)', [data.nombre, data.correo]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando proveedor:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateSupplier(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            const result = yield db_1.default.query('UPDATE proveedores SET nombre = ?, correo = ? WHERE id = ?', [data.nombre, data.correo, id]);
            if (!result) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando proveedor:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteSupplier(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM proveedores WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }
            return res.json({ message: 'Proveedor eliminado correctamente' });
        }
        catch (error) {
            console.error('Error eliminando proveedor:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};
