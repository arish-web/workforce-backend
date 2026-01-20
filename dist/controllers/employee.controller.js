"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllEmployees = void 0;
const prisma_1 = require("../config/prisma");
const listAllEmployees = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {
        role: "EMPLOYEE",
    };
    const [data, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { location: true },
        }),
        prisma_1.prisma.user.count({ where }),
    ]);
    res.json({
        data,
        total,
        page,
        limit,
    });
};
exports.listAllEmployees = listAllEmployees;
