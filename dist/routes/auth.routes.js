"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * Auth routes
 */
router.post("/login", auth_controller_1.login);
router.post("/register", auth_controller_1.register);
router.get("/me", (0, auth_middleware_1.requireAuth)(), auth_controller_1.me);
exports.default = router;
