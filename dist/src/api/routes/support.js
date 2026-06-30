"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const support_1 = __importDefault(require("../../controllers/support"));
const router = (0, express_1.Router)();
router.route("/all").get(support_1.default.getAllSupport);
router.get("/:id", support_1.default.getSupportById);
router.post("/create", support_1.default.createSupport);
router.put("/update/:id", support_1.default.updateSupport);
router.delete("/delete/:id", support_1.default.deleteSupport);
exports.default = router;
