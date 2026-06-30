"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userAddresses_1 = __importDefault(require("../../controllers/userAddresses"));
const router = (0, express_1.Router)();
router.route("/all").get(userAddresses_1.default.getAllUserAddresses);
router.get("/:id", userAddresses_1.default.getUserAddressById);
router.post("/create", userAddresses_1.default.createUserAddress);
router.put("/update/:id", userAddresses_1.default.updateUserAddress);
router.delete("/delete/:id", userAddresses_1.default.deleteUserAddress);
exports.default = router;
