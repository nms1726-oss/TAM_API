"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("../../controllers/users"));
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
router.route("/all").get(users_1.default.getAllUsers);
router.get("/check-username", users_1.default.checkUsername);
router.get("/:id", users_1.default.getUserById);
router.post("/create", users_1.default.createUser);
router.put("/update/:id", users_1.default.updateUser);
router.delete("/delete/:id", users_1.default.deleteUser);
router.put("/upload-photo/:id", upload_1.upload.single('foto'), users_1.default.uploadProfilePhoto);
exports.default = router;
