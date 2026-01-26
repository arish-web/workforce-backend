"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_controller_1 = require("../../controllers/admin.controller");
const router = (0, express_1.Router)();
// 🔐 Admin only
router.use((0, auth_middleware_1.requireAuth)());
router.use(auth_middleware_1.requireAuth(["ADMIN"]));
/* EMPLOYEES */
router.post("/employees", admin_controller_1.createEmployee);
router.get("/employees", admin_controller_1.listEmployees);
router.patch("/employees/:id", admin_controller_1.updateEmployee);
router.patch("/employees/:id/status", admin_controller_1.toggleEmployeeStatus);
/* MANAGERS (same table, role-based) */
router.post("/managers", (req, _res, next) => {
    req.body.role = "MANAGER";
    next();
}, admin_controller_1.createEmployee);
router.get("/managers", (req, _res, next) => {
    req.query.role = "MANAGER";
    next();
}, admin_controller_1.listEmployees);
/* LOCATIONS */
router.post("/locations", admin_controller_1.createLocation);
router.get("/locations", admin_controller_1.listLocations);
exports.default = router;
