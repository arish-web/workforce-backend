"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Role-based authentication middleware
 * @param roles Allowed roles (empty array = any authenticated user)
 */
const requireAuth = (roles = []) => (req, res, next) => {
    const authHeader = req.headers.authorization;
    // 1️⃣ Check token presence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        // 2️⃣ Verify JWT
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        // 3️⃣ Role-based access check (if roles provided)
        if (roles.length > 0 && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        // 4️⃣ Attach user to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.requireAuth = requireAuth;
