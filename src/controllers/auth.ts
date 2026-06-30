import db from '../database/db';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { enviarCorreoVerificacion } from '../config/mailer';

const JWT_SECRET = 'secret_key';

async function login(req: Request, res: Response): Promise<Response> {
    const data = req.body as Auth;

    if (!data.user_name || !data.password) {
        return res.status(400).json({
            error: 'Usuario y contraseña son obligatorios'
        });
    }

    try {
        const result = await db.query(
            'SELECT * FROM usuarios WHERE user_name = ?',
            [data.user_name]
        );

        const user: User | undefined =
            Array.isArray(result) && result.length > 0
                ? result[0] as User
                : undefined;

        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        if (user.estado === 0) {
            return res.status(403).json({
                error: 'Usuario inactivo'
            });
        }

        const validPassword = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                error: 'Contraseña incorrecta'
            });
        }

        const token = jwt.sign(
            {
                id: (user as any).id,
                email: user.email,
                user_name: user.user_name,
                rol_id: user.rol_id
            },
            JWT_SECRET,
            {
                expiresIn: '8h'
            }
        );

        return res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: (user as any).id,
                nombre_completo: user.nombre_completo,
                email: user.email,
                user_name: user.user_name,
                rol_id: user.rol_id,
                foto_perfil: user.foto_perfil
            }
        });

    } catch (error) {
        console.error('Error en login:', error);

        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

async function register(req: Request, res: Response): Promise<Response> {
    const data = req.body as User;

    if (
        !data.nombre_completo ||
        !data.email ||
        !data.password ||
        !data.user_name
    ) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios'
        });
    }

    try {

        const existingUser = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [data.email]
        );

        if (Array.isArray(existingUser) && existingUser.length > 0) {
            return res.status(409).json({
                error: 'El correo ya está registrado'
            });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const result = await db.query(
            `INSERT INTO usuarios
            (
                nombre_completo,
                tipo_documento,
                identificacion,
                fecha_nacimiento,
                email,
                password,
                verificado,
                token_verificacion,
                user_name,
                foto_perfil,
                rol_id,
                estado,
                fecha_ultimo_intento
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.nombre_completo,
                data.tipo_documento,
                data.identificacion,
                data.fecha_nacimiento,
                data.email,
                hashedPassword,
                data.verificado ?? 1,
                data.token_verificacion ?? null,
                data.user_name,
                data.foto_perfil ?? null,
                data.rol_id,
                data.estado ?? 1,
                null
            ]
        );

        return res.status(201).json({
            message: 'Usuario registrado correctamente',
            id: result
        });

    } catch (error) {
        console.error('Error en register:', error);

        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

async function changePassword(
    req: Request,
    res: Response
): Promise<Response> {

    const id = parseInt(req.params.id as string);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            error: 'La contraseña actual y la nueva contraseña son obligatorias'
        });
    }

    try {

        const result = await db.query(
            'SELECT password FROM usuarios WHERE id = ?',
            [id]
        );

        const user =
            Array.isArray(result) && result.length > 0
                ? result[0] as User
                : undefined;

        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        const validPassword = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                error: 'La contraseña actual es incorrecta'
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await db.query(
            'UPDATE usuarios SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );

        return res.status(200).json({
            message: 'Contraseña actualizada correctamente'
        });

    } catch (error) {

        console.error('Error cambiando contraseña:', error);

        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

async function enviarCodigoVerificacion(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ success: false, message: 'user_id es obligatorio' });
    }

    try {
        const result = await db.query('SELECT * FROM usuarios WHERE id = ?', [user_id]);
        const user: User | undefined =
            Array.isArray(result) && result.length > 0 ? result[0] as User : undefined;

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (user.verificado) {
            return res.status(400).json({ success: false, message: 'La cuenta ya está verificada' });
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const expiracion = new Date(Date.now() + 3 * 60 * 1000); // 3 minutos

        await db.query(
            'UPDATE usuarios SET token_verificacion = ?, fecha_ultimo_intento = ? WHERE id = ?',
            [`${codigo}|${expiracion.toISOString()}`, new Date(), user_id]
        );

        await enviarCorreoVerificacion(user.email, user.nombre_completo, codigo);

        return res.json({
            success: true,
            message: 'Código enviado al correo',
            expires_in: 180,
        });

    } catch (error) {
        console.error('Error enviando código:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
}

async function verificarCodigo(req: Request, res: Response): Promise<Response> {
    const { user_id, code } = req.body;

    if (!user_id || !code) {
        return res.status(400).json({ success: false, message: 'user_id y code son obligatorios' });
    }

    try {
        const result = await db.query('SELECT * FROM usuarios WHERE id = ?', [user_id]);
        const user: User | undefined =
            Array.isArray(result) && result.length > 0 ? result[0] as User : undefined;

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (user.verificado) {
            return res.status(400).json({ success: false, message: 'La cuenta ya está verificada' });
        }

        const guardado = user.token_verificacion; // formato: "123456|2026-06-28T..."
        if (!guardado) {
            return res.status(400).json({ success: false, message: 'No hay un código pendiente. Solicita uno nuevo.' });
        }

        const [codigoGuardado, fechaExpiracion] = guardado.split('|');

        if (new Date() > new Date(fechaExpiracion)) {
            return res.status(410).json({ success: false, message: 'El código expiró. Solicita uno nuevo.' });
        }

        if (code !== codigoGuardado) {
            return res.status(400).json({ success: false, message: 'Código incorrecto' });
        }

        await db.query(
            'UPDATE usuarios SET verificado = 1, estado = 1, token_verificacion = NULL WHERE id = ?',
            [user_id]
        );

        return res.json({
            success: true,
            message: 'Cuenta verificada correctamente',
            user: {
                id: user_id,
                user_name: user.user_name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error('Error verificando código:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
}

export default {
    login,
    register,
    changePassword,
    enviarCodigoVerificacion,
    verificarCodigo,
};