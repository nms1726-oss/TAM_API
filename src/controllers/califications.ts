import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { Calification } from '../models/calification.model';

async function getAllCalifications(_req: Request, res: Response): Promise<Response | void> {

    try {

        const result = await db.query(
            `SELECT
                c.*,
                u.nombre_completo,
                u.identificacion,
                p.nombre AS producto
            FROM calificaciones c
            LEFT JOIN usuarios u
                ON c.usuario_id = u.id
            INNER JOIN productos p
                ON c.producto_id = p.id`,
            []
        );

        return res.json(emptyOrRows(result));

    } catch (error) {

        console.error('Error obteniendo calificaciones:', error);

        return res.status(500).json({
            error: 'Error interno del servidor'
        });

    }

}

async function getCalificationById(req: Request, res: Response): Promise<Response | void> {

    const id = parseInt(req.params.id as string);

    try {

        const result = await db.query(
            `SELECT
                c.*,
                u.nombre_completo,
                u.identificacion,
                p.nombre AS producto
            FROM calificaciones c
            LEFT JOIN usuarios u
                ON c.usuario_id = u.id
            INNER JOIN productos p
                ON c.producto_id = p.id
            WHERE c.id = ?`,
            [id]
        );

        const calificacion =
            Array.isArray(result) && result.length > 0
                ? result[0]
                : undefined;

        if (!calificacion) {
            return res.status(404).json({
                error: 'Calificación no encontrada'
            });
        }

        return res.json(calificacion);

    } catch (error) {

        console.error('Error obteniendo calificación:', error);

        return res.status(500).json({
            error: 'Error interno del servidor'
        });

    }

}

async function createCalification(req: Request, res: Response) {
    const { estado, puntuacion, comentario, imagen, producto_id, usuario_id } = req.body as Calification;

    // Validación de campo obligatorio según tu esquema
    if (!producto_id) {
        return res.status(400).json({ error: 'El campo producto_id es obligatorio' });
    }

    try {
        const result = await db.query(
            `INSERT INTO calificaciones 
            (estado, puntuacion, comentario, imagen, producto_id, usuario_id) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [estado || null, puntuacion || null, comentario || null, imagen || null, producto_id, usuario_id || null]
        );
        
        return res.status(201).json({ 
            id: result, 
            estado, 
            puntuacion, 
            comentario, 
            imagen, 
            producto_id, 
            usuario_id 
        });
    } catch (error) {
        console.error('Error creando calificación:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateCalification(req: Request, res: Response): Promise<Response> {

    const id = parseInt(req.params.id as string);

    try {

        // Verificar que exista
        const existe = await db.query(
            'SELECT * FROM calificaciones WHERE id = ?',
            [id]
        );

        if (!Array.isArray(existe) || existe.length === 0) {
            return res.status(404).json({
                error: 'Calificación no encontrada'
            });
        }

        const actual: any = existe[0];

        const datos = {
            estado: req.body.estado ?? actual.estado,
            puntuacion: req.body.puntuacion ?? actual.puntuacion,
            comentario: req.body.comentario ?? actual.comentario,
            imagen: req.body.imagen ?? actual.imagen,
            producto_id: req.body.producto_id ?? actual.producto_id,
            usuario_id: req.body.usuario_id ?? actual.usuario_id
        };

        await db.query(
            `UPDATE calificaciones
             SET estado = ?,
                 puntuacion = ?,
                 comentario = ?,
                 imagen = ?,
                 producto_id = ?,
                 usuario_id = ?
             WHERE id = ?`,
            [
                datos.estado,
                datos.puntuacion,
                datos.comentario,
                datos.imagen,
                datos.producto_id,
                datos.usuario_id,
                id
            ]
        );

        return res.json({
            id,
            ...datos
        });

    } catch (error) {

        console.error('Error actualizando calificación:', error);

        return res.status(500).json({
            error: 'Error interno del servidor'
        });

    }

}

async function deleteCalification(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM calificaciones WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Calificación no encontrada' });
        }

        return res.json({ message: 'Calificación eliminada correctamente' });
    } catch (error) {
        console.error('Error eliminando calificación:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllCalifications,
    getCalificationById,
    createCalification,
    updateCalification,
    deleteCalification,
};