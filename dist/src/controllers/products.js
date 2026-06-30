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
const path_1 = __importDefault(require("path"));
function getAllProducts(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM productos', []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo los productos:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function getProductById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('SELECT * FROM productos WHERE id = ?', [id]);
            const product = Array.isArray(result) && result.length > 0 ? result[0] : undefined;
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            return res.json(product);
        }
        catch (error) {
            console.error('Error obteniendo el producto:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (req.file) {
            data.imagen = path_1.default.posix.join('assets', 'img', req.file.filename);
        }
        if (!data.nombre ||
            data.precio === undefined ||
            !data.descripcion ||
            !data.caracteristicas_tecnicas ||
            data.stock === undefined ||
            data.costo === undefined ||
            !data.subcategoria_id) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios'
            });
        }
        try {
            const result = yield db_1.default.query(`INSERT INTO productos
            (nombre, precio, marca, descripcion, caracteristicas_tecnicas, imagen, stock, costo, subcategoria_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                data.nombre,
                data.precio,
                data.marca,
                data.descripcion,
                typeof data.caracteristicas_tecnicas === 'string'
                    ? data.caracteristicas_tecnicas
                    : JSON.stringify(data.caracteristicas_tecnicas),
                data.imagen,
                data.stock,
                data.costo,
                data.subcategoria_id
            ]);
            return res.status(201).json(Object.assign({ id: result.insertId }, data));
        }
        catch (error) {
            console.error('Error creando el producto:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = req.body;
        if (req.file) {
            data.imagen = path_1.default.posix.join('assets', 'img', req.file.filename);
        }
        try {
            let fields = [];
            let values = [];
            if (data.nombre !== undefined) {
                fields.push('nombre = ?');
                values.push(data.nombre);
            }
            if (data.precio !== undefined) {
                fields.push('precio = ?');
                values.push(data.precio);
            }
            if (data.marca !== undefined) {
                fields.push('marca = ?');
                values.push(data.marca);
            }
            if (data.descripcion !== undefined) {
                fields.push('descripcion = ?');
                values.push(data.descripcion);
            }
            if (data.caracteristicas_tecnicas !== undefined) {
                fields.push('caracteristicas_tecnicas = ?');
                values.push(typeof data.caracteristicas_tecnicas === 'string'
                    ? data.caracteristicas_tecnicas
                    : JSON.stringify(data.caracteristicas_tecnicas));
            }
            if (data.imagen !== undefined) {
                fields.push('imagen = ?');
                values.push(data.imagen);
            }
            if (data.stock !== undefined) {
                fields.push('stock = ?');
                values.push(data.stock);
            }
            if (data.costo !== undefined) {
                fields.push('costo = ?');
                values.push(data.costo);
            }
            if (data.subcategoria_id !== undefined) {
                fields.push('subcategoria_id = ?');
                values.push(data.subcategoria_id);
            }
            if (fields.length === 0) {
                return res.status(400).json({
                    error: 'No hay campos para actualizar'
                });
            }
            const query = `UPDATE productos SET ${fields.join(', ')} WHERE id = ?`;
            values.push(id);
            const result = yield db_1.default.query(query, values);
            if (!result) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            return res.json(Object.assign({ id }, data));
        }
        catch (error) {
            console.error('Error actualizando el producto:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM productos WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            return res.json({ message: 'Producto eliminado correctamente' });
        }
        catch (error) {
            console.error('Error eliminando el producto:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
