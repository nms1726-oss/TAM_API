"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderDetails_1 = __importDefault(require("../../controllers/orderDetails"));
const router = (0, express_1.Router)();
router.route("/all").get(orderDetails_1.default.getAllOrderDetails);
router.get("/:id", orderDetails_1.default.getOrderDetailById);
router.post("/create", orderDetails_1.default.createOrderDetail);
router.put("/update/:id", orderDetails_1.default.updateOrderDetail);
router.delete("/delete/:id", orderDetails_1.default.deleteOrderDetail);
exports.default = router;
