"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const califications_1 = __importDefault(require("../../controllers/califications"));
const router = (0, express_1.Router)();
router.route("/all").get(califications_1.default.getAllCalifications);
router.get("/:id", califications_1.default.getCalificationById);
router.post("/create", califications_1.default.createCalification);
router.put("/update/:id", califications_1.default.updateCalification);
router.delete("/delete/:id", califications_1.default.deleteCalification);
exports.default = router;
