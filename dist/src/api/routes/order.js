"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = __importDefault(require("../../controllers/orders"));
const router = (0, express_1.Router)();
router.route("/all").get(orders_1.default.getAllOrders);
router.get("/:id", orders_1.default.getOrderById);
router.post("/create", orders_1.default.createOrder);
router.put("/update/:id", orders_1.default.updateOrder);
router.delete("/delete/:id", orders_1.default.deleteOrder);
exports.default = router;
