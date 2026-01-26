"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/employee.routes.ts
const express_1 = require("express");
const employee_controller_1 = require("../../controllers/employee.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// 🔐 any logged-in employee
router.use((0, auth_middleware_1.requireAuth)());
router.use(auth_middleware_1.requireAuth(["EMPLOYEE"]));
// 📋 get tasks assigned to logged-in employee
router.get("/tasks", employee_controller_1.getMyTasks);
// ✏️ update status of own task
router.patch("/tasks/:id", employee_controller_1.updateMyTaskStatus);
exports.default = router;
