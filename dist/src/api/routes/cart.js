"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carts_1 = __importDefault(require("../../controllers/carts"));
const router = (0, express_1.Router)();
router.route("/all").get(carts_1.default.getAllCarts);
router.get("/:id", carts_1.default.getCartById);
router.post("/create", carts_1.default.createCart);
router.put("/update/:id", carts_1.default.updateCart);
router.delete("/delete/:id", carts_1.default.deleteCart);
exports.default = router;
