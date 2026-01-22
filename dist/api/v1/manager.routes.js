"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const manager_controller_1 = require("../../controllers/manager.controller");
const router = (0, express_1.Router)();
// auth
router.use(auth_middleware_1.requireAuth());
router.use(auth_middleware_1.requireAuth(["MANAGER"]));
// routes — CAST CONTROLLERS
router.get("/dashboard-summary", manager_controller_1.getManagerDashboardSummary);
router.get("/employees", manager_controller_1.listManagerEmployees);
router.get("/tasks", manager_controller_1.listManagerTasks);
router.get("/tasks/:id", manager_controller_1.getManagerTaskById);
router.post("/tasks", manager_controller_1.createManagerTask);
exports.default = router;
