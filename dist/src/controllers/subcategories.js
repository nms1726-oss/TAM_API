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
function getAllSubcategories(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM subcategorias', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo subcategorias:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getSubcategoryById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('SELECT * FROM subcategorias WHERE id = ?', [id]);
            const subcategory = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!subcategory) {
                return res.status(404).json({ error: 'Subcategoría no encontrada' });
            }
            return res.json(subcategory);
        }
        catch (error) {
            console.error('Error obteniendo subcategoría:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createSubcategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.descripcion || !data.categoria_id) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        try {
            const result = yield db_1.default.query('INSERT INTO subcategorias (descripcion, categoria_id) VALUES (?, ?)', [data.descripcion, data.categoria_id]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando subcategoría:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateSubcategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            const result = yield db_1.default.query('UPDATE subcategorias SET descripcion = ? WHERE id = ?', [data.descripcion, id]);
            if (!result) {
                return res.status(404).json({ error: 'Subcategoría no encontrada' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando subcategoría:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteSubcategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM subcategorias WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Subcategoría no encontrada' });
            }
            return res.json({ message: 'Subcategoría eliminada correctamente' });
        }
        catch (error) {
            console.error('Error eliminando subcategoría:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllSubcategories,
    getSubcategoryById,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
};
