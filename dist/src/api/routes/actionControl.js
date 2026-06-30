"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const actionControls_1 = __importDefault(require("../../controllers/actionControls"));
const router = (0, express_1.Router)();
router.route("/all").get(actionControls_1.default.getAllActionControls);
router.get("/:id", actionControls_1.default.getActionControlById);
router.post("/create", actionControls_1.default.createActionControl);
router.put("/update/:id", actionControls_1.default.updateActionControl);
router.delete("/delete/:id", actionControls_1.default.deleteActionControl);
exports.default = router;
