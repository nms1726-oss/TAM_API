"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplierPhones_1 = __importDefault(require("../../controllers/supplierPhones"));
const router = (0, express_1.Router)();
router.route("/all").get(supplierPhones_1.default.getAllSupplierPhones);
router.get("/:id", supplierPhones_1.default.getSupplierPhoneById);
router.post("/create", supplierPhones_1.default.createSupplierPhone);
router.put("/update/:id", supplierPhones_1.default.updateSupplierPhone);
router.delete("/delete/:id", supplierPhones_1.default.deleteSupplierPhone);
exports.default = router;
