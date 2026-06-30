"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userPaymentMethods_1 = __importDefault(require("../../controllers/userPaymentMethods"));
const router = (0, express_1.Router)();
router.route("/all").get(userPaymentMethods_1.default.getAllUserPaymentMethods);
router.get("/:id", userPaymentMethods_1.default.getUserPaymentMethodById);
router.post("/create", userPaymentMethods_1.default.createUserPaymentMethod);
router.put("/update/:id", userPaymentMethods_1.default.updateUserPaymentMethod);
router.delete("/delete/:id", userPaymentMethods_1.default.deleteUserPaymentMethod);
exports.default = router;
