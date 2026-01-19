"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const auth_service_1 = require("./auth.service");
const auth_schema_1 = require("./auth.schema");
async function login(req, res) {
    const body = auth_schema_1.loginSchema.parse(req.body);
    const data = await (0, auth_service_1.loginUser)(body.email, body.password);
    res.json(data);
}
