import dotenv from 'dotenv';

import { ServerHTTP } from '../servers/http';
import { API } from './api/interfaces';
import { ExpressApi } from './api/api';
import config from './config/config';

dotenv.config();

const host = process.env.SERVER_URL || 'http://localhost';
const port = Number(process.env.PORT || config.port);
const BASE_URL = `${host}:${port}`;

const api: API = new ExpressApi(BASE_URL);
const httpServer = new ServerHTTP(host, port, api.createServer());

try {
  httpServer.listen();
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error al iniciar el servidor: ${error.message}`);
  } else {
    console.error('Unknown error occurred');
  }
}