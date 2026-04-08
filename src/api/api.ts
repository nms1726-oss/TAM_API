import express, { Router } from 'express';
import { Server } from 'http';
import * as http from 'http';

import { API } from './interfaces';
import { healthCheck } from './routes/healthCheck';
import products from './routes/product';


export class ExpressApi implements API {
  private router: Router;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.router = Router();

    this.router.use("/products", products);
    // this.router.get("/health", healthCheck);
    // aqui puedes agregar más rutas
  }

  public createServer = (): Server => {
    const expressApp: express.Application = express();

    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    expressApp.use('/', this.router);

    return http.createServer(expressApp);
  }
}