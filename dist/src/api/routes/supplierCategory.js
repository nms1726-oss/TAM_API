"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplierCategories_1 = __importDefault(require("../../controllers/supplierCategories"));
const router = (0, express_1.Router)();
router.route("/all").get(supplierCategories_1.default.getAllSupplierCategories);
router.get("/:proveedor_id/:categoria_id", supplierCategories_1.default.getSupplierCategoryById);
router.post("/create", supplierCategories_1.default.createSupplierCategory);
router.put("/update/:proveedor_id/:categoria_id", supplierCategories_1.default.updateSupplierCategory);
router.delete("/delete/:proveedor_id/:categoria_id", supplierCategories_1.default.deleteSupplierCategory);
exports.default = router;
