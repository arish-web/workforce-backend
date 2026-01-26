"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const manager_controller_1 = require("../../controllers/manager.controller");
const router = (0, express_1.Router)();
// 🔐 manager-only access
router.use((0, auth_middleware_1.requireAuth)());
router.use(auth_middleware_1.requireAuth(["MANAGER"]));
// router.use(requireAuth(["MANAGER"]));
// routes
router.get("/dashboard/summary", manager_controller_1.getManagerDashboardSummary);
router.get("/tasks", manager_controller_1.getManagerTasks);
router.post("/tasks", manager_controller_1.createManagerTask);
router.get("/employees", manager_controller_1.getManagerEmployees);
exports.default = router;
