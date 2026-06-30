"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comparisonHistories_1 = __importDefault(require("../../controllers/comparisonHistories"));
const router = (0, express_1.Router)();
router.route("/all").get(comparisonHistories_1.default.getAllComparisonHistories);
router.get("/:id", comparisonHistories_1.default.getComparisonHistoryById);
router.post("/create", comparisonHistories_1.default.createComparisonHistory);
router.put("/update/:id", comparisonHistories_1.default.updateComparisonHistory);
router.delete("/delete/:id", comparisonHistories_1.default.deleteComparisonHistory);
exports.default = router;
