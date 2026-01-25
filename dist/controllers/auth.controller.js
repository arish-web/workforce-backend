"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
exports.login = login;
exports.register = register;
exports.me = me;
const auth_service_1 = require("../services/auth.service");
const auth_schema_1 = require("../validators/auth.schema");
const jwt_1 = require("../utils/jwt");
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
// export const refreshToken = (req: Request, res: Response) => {
//   try {
//     const { refreshToken } = req.body;
//     const token = refreshAccessToken(refreshToken);
//     res.json(token);
//   } catch (err: any) {
//     res.status(401).json({ message: err.message });
//   }
// };
// export const refreshToken = (req: Request, res: Response) => {
//   const { refreshToken } = req.body;
//   console.log("refreshToken",   refreshToken)
//   if (!refreshToken) {
//     return res.status(401).json({ message: "Refresh token missing" });
//   }
//   try {
//     const decoded = verifyRefreshToken(refreshToken) as any;
//     const newAccessToken = signAccessToken({
//       id: decoded.userId,
//       role: decoded.role,
//     });
//     return res.json({
//       accessToken: newAccessToken,
//     });
//   } catch {
//     return res.status(403).json({ message: "Invalid refresh token" });
//   }
// };
const refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
    }
    try {
        // const decoded = verifyRefreshToken(refreshToken) as any;
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const newAccessToken = (0, jwt_1.signAccessToken)({
            userId: decoded.userId, // ✅ THIS MUST BE userId
            role: decoded.role,
            email: decoded.email, // optional but good
        });
        return res.json({
            accessToken: newAccessToken,
        });
    }
    catch {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};
exports.refreshToken = refreshToken;
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
