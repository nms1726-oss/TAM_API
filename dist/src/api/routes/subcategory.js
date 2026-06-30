"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subcategories_1 = __importDefault(require("../../controllers/subcategories"));
const router = (0, express_1.Router)();
router.route("/all").get(subcategories_1.default.getAllSubcategories);
router.get("/:id", subcategories_1.default.getSubcategoryById);
router.post("/create", subcategories_1.default.createSubcategory);
router.put("/update/:id", subcategories_1.default.updateSubcategory);
router.delete("/delete/:id", subcategories_1.default.deleteSubcategory);
exports.default = router;
