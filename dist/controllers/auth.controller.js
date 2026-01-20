"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
exports.me = me;
const auth_service_1 = require("../services/auth.service");
const auth_schema_1 = require("../validators/auth.schema");
async function login(req, res) {
    try {
        const body = auth_schema_1.loginSchema.parse(req.body);
        console.log("LOGIN BODY:", body);
        const data = await (0, auth_service_1.loginUser)(body.email, body.password);
        return res.json(data);
    }
    catch (err) {
        console.error("LOGIN ERROR:", err.message);
        return res.status(401).json({ message: err.message });
    }
}
async function register(req, res) {
    try {
        const body = auth_schema_1.registerSchema.parse(req.body);
        const user = await (0, auth_service_1.registerUser)(body.email, body.password, body.role);
        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
}
/**
 * GET /auth/me
 */
async function me(req, res) {
    return res.json({
        userId: req.user?.userId,
        role: req.user?.role,
    });
}
