"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = __importDefault(require("../../controllers/products"));
const uploadProductos_1 = require("../../middlewares/uploadProductos");
const router = (0, express_1.Router)();
router.get("/all", products_1.default.getAllProducts);
router.get("/:id", products_1.default.getProductById);
router.post("/create", (req, res, next) => {
    uploadProductos_1.uploadProductos.single("imagen")(req, res, (err) => {
        if (err) {
            return res.status(409).json({
                error: err.message
            });
        }
        if (req.file) {
            req.body.imagen = `assets/img/${req.file.filename}`;
        }
        next();
    });
}, products_1.default.createProduct);
router.put("/update/:id", (req, res, next) => {
    uploadProductos_1.uploadProductos.single("imagen")(req, res, (err) => {
        if (err) {
            return res.status(409).json({
                error: err.message
            });
        }
        if (req.file) {
            req.body.imagen = `assets/img/${req.file.filename}`;
        }
        next();
    });
}, products_1.default.updateProduct);
router.delete("/delete/:id", products_1.default.deleteProduct);
exports.default = router;
