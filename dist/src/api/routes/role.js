"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roles_1 = __importDefault(require("../../controllers/roles"));
const router = (0, express_1.Router)();
router.route("/all").get(roles_1.default.getAllRoles);
router.get("/:id", roles_1.default.getRoleById);
router.post("/create", roles_1.default.createRole);
router.put("/update/:id", roles_1.default.updateRole);
router.delete("/delete/:id", roles_1.default.deleteRole);
exports.default = router;
