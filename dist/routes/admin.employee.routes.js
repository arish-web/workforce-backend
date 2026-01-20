"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_employee_controller_1 = require("../controllers/admin.employee.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Admin-only access
router.use((0, auth_middleware_1.requireAuth)(["ADMIN"]));
router.post("/employees", admin_employee_controller_1.createEmployee);
router.get("/employees", admin_employee_controller_1.listEmployees);
router.patch("/employees/:id", admin_employee_controller_1.updateEmployee);
router.patch("/employees/:id/status", admin_employee_controller_1.toggleEmployeeStatus);
exports.default = router;
