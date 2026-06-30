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
function getAllCalifications(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query(`SELECT
                c.*,
                u.nombre_completo,
                u.identificacion,
                p.nombre AS producto
            FROM calificaciones c
            LEFT JOIN usuarios u
                ON c.usuario_id = u.id
            INNER JOIN productos p
                ON c.producto_id = p.id`, []);
            return res.json((0, helper_1.emptyOrRows)(result));
        }
        catch (error) {
            console.error('Error obteniendo calificaciones:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
function getCalificationById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query(`SELECT
                c.*,
                u.nombre_completo,
                u.identificacion,
                p.nombre AS producto
            FROM calificaciones c
            LEFT JOIN usuarios u
                ON c.usuario_id = u.id
            INNER JOIN productos p
                ON c.producto_id = p.id
            WHERE c.id = ?`, [id]);
            const calificacion = Array.isArray(result) && result.length > 0
                ? result[0]
                : undefined;
            if (!calificacion) {
                return res.status(404).json({
                    error: 'Calificación no encontrada'
                });
            }
            return res.json(calificacion);
        }
        catch (error) {
            console.error('Error obteniendo calificación:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
function createCalification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { estado, puntuacion, comentario, imagen, producto_id, usuario_id } = req.body;
        // Validación de campo obligatorio según tu esquema
        if (!producto_id) {
            return res.status(400).json({ error: 'El campo producto_id es obligatorio' });
        }
        try {
            const result = yield db_1.default.query(`INSERT INTO calificaciones 
            (estado, puntuacion, comentario, imagen, producto_id, usuario_id) 
            VALUES (?, ?, ?, ?, ?, ?)`, [estado || null, puntuacion || null, comentario || null, imagen || null, producto_id, usuario_id || null]);
            return res.status(201).json({
                id: result,
                estado,
                puntuacion,
                comentario,
                imagen,
                producto_id,
                usuario_id
            });
        }
        catch (error) {
            console.error('Error creando calificación:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
function updateCalification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const id = parseInt(req.params.id);
        try {
            // Verificar que exista
            const existe = yield db_1.default.query('SELECT * FROM calificaciones WHERE id = ?', [id]);
            if (!Array.isArray(existe) || existe.length === 0) {
                return res.status(404).json({
                    error: 'Calificación no encontrada'
                });
            }
            const actual = existe[0];
            const datos = {
                estado: (_a = req.body.estado) !== null && _a !== void 0 ? _a : actual.estado,
                puntuacion: (_b = req.body.puntuacion) !== null && _b !== void 0 ? _b : actual.puntuacion,
                comentario: (_c = req.body.comentario) !== null && _c !== void 0 ? _c : actual.comentario,
                imagen: (_d = req.body.imagen) !== null && _d !== void 0 ? _d : actual.imagen,
                producto_id: (_e = req.body.producto_id) !== null && _e !== void 0 ? _e : actual.producto_id,
                usuario_id: (_f = req.body.usuario_id) !== null && _f !== void 0 ? _f : actual.usuario_id
            };
            yield db_1.default.query(`UPDATE calificaciones
             SET estado = ?,
                 puntuacion = ?,
                 comentario = ?,
                 imagen = ?,
                 producto_id = ?,
                 usuario_id = ?
             WHERE id = ?`, [
                datos.estado,
                datos.puntuacion,
                datos.comentario,
                datos.imagen,
                datos.producto_id,
                datos.usuario_id,
                id
            ]);
            return res.json(Object.assign({ id }, datos));
        }
        catch (error) {
            console.error('Error actualizando calificación:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
function deleteCalification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            const result = yield db_1.default.query('DELETE FROM calificaciones WHERE id = ?', [id]);
            if (!result) {
                return res.status(404).json({ error: 'Calificación no encontrada' });
            }
            return res.json({ message: 'Calificación eliminada correctamente' });
        }
        catch (error) {
            console.error('Error eliminando calificación:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.default = {
    getAllCalifications,
    getCalificationById,
    createCalification,
    updateCalification,
    deleteCalification,
};
