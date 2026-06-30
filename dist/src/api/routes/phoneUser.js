"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const phoneUsers_1 = __importDefault(require("..//../controllers/phoneUsers"));
const router = (0, express_1.Router)();
router.route("/all").get(phoneUsers_1.default.getAllphoneUsers);
router.get("/:id", phoneUsers_1.default.getphoneUserById);
router.post("/create", phoneUsers_1.default.createphoneUser);
router.put("/update/:id", phoneUsers_1.default.updatephoneUser);
router.delete("/delete/:id", phoneUsers_1.default.deletephoneUser);
exports.default = router;
