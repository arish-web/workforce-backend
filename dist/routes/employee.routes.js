"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/employee.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// any logged-in user (admin / manager) can access
router.use((0, auth_middleware_1.requireAuth)());
router.get("/employees", employee_controller_1.listAllEmployees);
exports.default = router;
