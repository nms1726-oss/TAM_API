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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerHTTP = void 0;
class ServerHTTP {
    constructor(host, port, httpServer) {
        this.host = host;
        this.port = port;
        this.httpServer = httpServer;
        this.address = `${this.host}:${this.port}`;
    }
    listen() {
        return new Promise((resolve) => {
            this.httpServer.listen(this.port, () => {
                console.log(`⚡️[server]: servidor corriendo en ${this.address}`);
                console.log('  Press CTRL-C to stop\n');
                resolve();
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.httpServer) {
                    this.httpServer.close((error) => {
                        if (error) {
                            return reject(error);
                        }
                        return resolve();
                    });
                }
                return resolve();
            });
        });
    }
}
exports.ServerHTTP = ServerHTTP;
