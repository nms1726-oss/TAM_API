"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartDetails_1 = __importDefault(require("../../controllers/cartDetails"));
const router = (0, express_1.Router)();
router.route("/all").get(cartDetails_1.default.getAllCartDetails);
router.get("/:id", cartDetails_1.default.getCartDetailById);
router.post("/create", cartDetails_1.default.createCartDetail);
router.put("/update/:id", cartDetails_1.default.updateCartDetail);
router.delete("/delete/:id", cartDetails_1.default.deleteCartDetail);
exports.default = router;
