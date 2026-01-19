"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../config/prisma");
const jwt_1 = require("../../utils/jwt");
async function loginUser(email, password) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("Invalid credentials");
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match)
        throw new Error("Invalid credentials");
    return {
        accessToken: (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role }),
        refreshToken: (0, jwt_1.signRefreshToken)({ userId: user.id }),
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    };
}
