import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';

//Import model and service necessary for the controller
import { Product } from '../models/product.model';


async function getAllProducts(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM productos', []);
        return res.json(emptyOrRows(result));

    } catch (error) {
        console.error('Error obteniendo los productos:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getProductById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);
    try {
        const result = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
        const product: Product | undefined = Array.isArray(result) && result.length > 0 ? result[0] as Product : undefined;
    if (product === null || product === undefined) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.json(product);
    } catch (error) {
        console.error('Error obteniendo el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createProduct(req: Request, res: Response) {
    const data = req.body as Product;
    if (!data.precio) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: name y price' });
    }
    try {
        const result = await db.query('INSERT INTO productos (nombre, precio, marca, caracteristicas_basicas, caracteristicas_tecnicas, imagen, stock, costo, subcategoria_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            data.nombre,
            data.precio,
            data.marca,
            data.caracteristicas_basicas,
            data.caracteristicas_tecnicas,
            data.imagen,
            data.stock,
            data.costo,
            data.subcategoria_id
        ]);
        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateProduct(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as Product;
    try {
        const result = await db.query('UPDATE productos SET stock = ?, precio = ?, caracteristicas_basicas = ?, caracteristicas_tecnicas = ? WHERE id = ?', [
            data.stock,
            data.precio,
            data.caracteristicas_basicas,
            data.caracteristicas_tecnicas,
            id
        ]);
        if (result === null || result === undefined) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteProduct(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    try {
        const result = await db.query('DELETE FROM productos WHERE id = ?', [id]);  
        if (result === null || result === undefined) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};