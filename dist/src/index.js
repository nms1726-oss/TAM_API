"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("../servers/http");
const api_1 = require("./api/api");
const config_1 = __importDefault(require("./config/config"));
dotenv_1.default.config();
const host = process.env.SERVER_URL || 'http://localhost';
const port = Number(process.env.PORT || config_1.default.port);
const BASE_URL = `${host}:${port}`;
const api = new api_1.ExpressApi(BASE_URL);
const httpServer = new http_1.ServerHTTP(host, port, api.createServer());
try {
    httpServer.listen();
}
catch (error) {
    if (error instanceof Error) {
        console.error(`Error al iniciar el servidor: ${error.message}`);
    }
    else {
        console.error('Unknown error occurred');
    }
}
