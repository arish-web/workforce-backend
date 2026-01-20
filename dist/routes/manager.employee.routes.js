"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const manager_employee_controller_1 = require("../controllers/manager.employee.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use((0, auth_middleware_1.requireAuth)(["MANAGER"]));
router.get("/employees", manager_employee_controller_1.getManagerEmployees);
exports.default = router;
