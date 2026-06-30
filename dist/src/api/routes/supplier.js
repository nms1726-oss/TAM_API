"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const suppliers_1 = __importDefault(require("../../controllers/suppliers"));
const router = (0, express_1.Router)();
router.route("/all").get(suppliers_1.default.getAllSuppliers);
router.get("/:id", suppliers_1.default.getSupplierById);
router.post("/create", suppliers_1.default.createSupplier);
router.put("/update/:id", suppliers_1.default.updateSupplier);
router.delete("/delete/:id", suppliers_1.default.deleteSupplier);
exports.default = router;
