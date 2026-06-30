"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    db: {
        host: "localhost",
        user: "root",
        database: process.env.DATABASE || "tam",
    },
    port: 3000,
    listPerPage: 100
};
exports.default = config;
