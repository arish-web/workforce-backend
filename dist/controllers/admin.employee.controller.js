"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleEmployeeStatus = exports.updateEmployee = exports.listEmployees = exports.createEmployee = void 0;
const prisma_1 = require("../config/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * CREATE EMPLOYEE
 */
const createEmployee = async (req, res) => {
    const { email, password, role, locationId } = req.body;
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            email: String(email),
            password: hashedPassword,
            role: role,
            locationId: locationId ? String(locationId) : null,
        },
    });
    res.status(201).json(user);
};
exports.createEmployee = createEmployee;
const listEmployees = async (req, res) => {
    const { role, location, status, page = "1", limit = "10" } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const where = {
        role: role || undefined,
        locationId: location || undefined,
        isActive: status === "active"
            ? true
            : status === "inactive"
                ? false
                : undefined,
    };
    const [data, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.user.findMany({
            where,
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            orderBy: { createdAt: "desc" },
            include: { location: true },
        }),
        prisma_1.prisma.user.count({ where }),
    ]);
    res.json({
        data,
        total,
        page: pageNum,
        limit: limitNum,
    });
};
exports.listEmployees = listEmployees;
/**
 * UPDATE ROLE / LOCATION
 */
const updateEmployee = async (req, res) => {
    const id = String(req.params.id);
    const { role, locationId } = req.body;
    const user = await prisma_1.prisma.user.update({
        where: { id },
        data: {
            ...(role && { role }),
            locationId: locationId === "" ? null : locationId,
        },
    });
    res.json(user);
};
exports.updateEmployee = updateEmployee;
/**
 * ACTIVATE / DEACTIVATE
 */
const toggleEmployeeStatus = async (req, res) => {
    const id = String(req.params.id);
    const { isActive } = req.body;
    const user = await prisma_1.prisma.user.update({
        where: { id },
        data: {
            isActive: Boolean(isActive),
        },
    });
    res.json(user);
};
exports.toggleEmployeeStatus = toggleEmployeeStatus;
