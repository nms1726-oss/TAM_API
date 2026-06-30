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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = 'secret_key';
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data.user_name || !data.password) {
            return res.status(400).json({
                error: 'Usuario y contraseña son obligatorios'
            });
        }
        try {
            const result = yield db_1.default.query('SELECT * FROM usuarios WHERE user_name = ?', [data.user_name]);
            const user = Array.isArray(result) && result.length > 0
                ? result[0]
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
            const validPassword = yield bcrypt_1.default.compare(data.password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    error: 'Contraseña incorrecta'
                });
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                user_name: user.user_name,
                rol_id: user.rol_id
            }, JWT_SECRET, {
                expiresIn: '8h'
            });
            return res.json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user.id,
                    nombre_completo: user.nombre_completo,
                    email: user.email,
                    user_name: user.user_name,
                    rol_id: user.rol_id,
                    foto_perfil: user.foto_perfil
                }
            });
        }
        catch (error) {
            console.error('Error en login:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const data = req.body;
        if (!data.nombre_completo ||
            !data.email ||
            !data.password ||
            !data.user_name) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios'
            });
        }
        try {
            const existingUser = yield db_1.default.query('SELECT * FROM usuarios WHERE email = ?', [data.email]);
            if (Array.isArray(existingUser) && existingUser.length > 0) {
                return res.status(409).json({
                    error: 'El correo ya está registrado'
                });
            }
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            const result = yield db_1.default.query(`INSERT INTO usuarios
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                data.nombre_completo,
                data.tipo_documento,
                data.identificacion,
                data.fecha_nacimiento,
                data.email,
                hashedPassword,
                (_a = data.verificado) !== null && _a !== void 0 ? _a : 1,
                (_b = data.token_verificacion) !== null && _b !== void 0 ? _b : null,
                data.user_name,
                (_c = data.foto_perfil) !== null && _c !== void 0 ? _c : null,
                data.rol_id,
                (_d = data.estado) !== null && _d !== void 0 ? _d : 1,
                null
            ]);
            return res.status(201).json({
                message: 'Usuario registrado correctamente',
                id: result
            });
        }
        catch (error) {
            console.error('Error en register:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'La contraseña actual y la nueva contraseña son obligatorias'
            });
        }
        try {
            const result = yield db_1.default.query('SELECT password FROM usuarios WHERE id = ?', [id]);
            const user = Array.isArray(result) && result.length > 0
                ? result[0]
                : undefined;
            if (!user) {
                return res.status(404).json({
                    error: 'Usuario no encontrado'
                });
            }
            const validPassword = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    error: 'La contraseña actual es incorrecta'
                });
            }
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            yield db_1.default.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, id]);
            return res.status(200).json({
                message: 'Contraseña actualizada correctamente'
            });
        }
        catch (error) {
            console.error('Error cambiando contraseña:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    });
}
exports.default = {
    login,
    register,
    changePassword
};
