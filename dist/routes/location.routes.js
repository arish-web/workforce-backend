"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const location_controller_1 = require("../controllers/location.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Any logged-in user can fetch locations
router.use(auth_middleware_1.requireAuth);
router.get("/locations", location_controller_1.getLocations);
exports.default = router;
