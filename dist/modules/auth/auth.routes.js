"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const prisma_1 = require("../../config/prisma");
const router = (0, express_1.Router)();
// public
router.post("/login", auth_controller_1.login);
// protected (proof JWT works)
router.get("/me", (0, auth_middleware_1.requireAuth)(), async (req, res) => {
    const { userId, role } = req.user;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
});
// role-protected example (ADMIN only)
router.get("/admin-check", (0, auth_middleware_1.requireAuth)(["ADMIN"]), (req, res) => {
    res.json({ message: "Admin access granted" });
});
exports.default = router;
