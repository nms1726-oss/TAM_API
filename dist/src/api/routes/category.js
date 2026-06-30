"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_1 = __importDefault(require("../../controllers/categories"));
const router = (0, express_1.Router)();
router.route("/all").get(categories_1.default.getAllCategories);
router.get("/:id", categories_1.default.getCategoryById);
router.post("/create", categories_1.default.createCategory);
router.put("/update/:id", categories_1.default.updateCategory);
router.delete("/delete/:id", categories_1.default.deleteCategory);
exports.default = router;
