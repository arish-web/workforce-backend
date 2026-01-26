"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLocations = exports.createLocation = exports.toggleEmployeeStatus = exports.updateEmployee = exports.listEmployees = exports.createEmployee = void 0;
const prisma_1 = require("../config/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/* =====================================================
   EMPLOYEES
===================================================== */
/**
 * CREATE EMPLOYEE / MANAGER
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
            isActive: true,
        },
    });
    res.status(201).json(user);
};
exports.createEmployee = createEmployee;
/**
 * LIST EMPLOYEES (PAGINATION + FILTERS)
 */
const listEmployees = async (req, res) => {
    const { role, location, status, page = "1", limit = "10" } = req.query;
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 100);
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
 * ACTIVATE / DEACTIVATE EMPLOYEE
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
/* =====================================================
   LOCATIONS
===================================================== */
/**
 * CREATE LOCATION
 */
const createLocation = async (req, res) => {
    const { name, managerId } = req.body;
    // ✅ get the ONLY organization
    const org = await prisma_1.prisma.organization.findFirst({
        where: { isActive: true },
    });
    if (!org) {
        return res.status(400).json({
            message: "No active organization found",
        });
    }
    const location = await prisma_1.prisma.location.create({
        data: {
            name,
            organizationId: org.id,
            managerId: managerId || null,
        },
    });
    res.status(201).json(location);
};
exports.createLocation = createLocation;
/**
 * LIST LOCATIONS
 */
const listLocations = async (_req, res) => {
    const locations = await prisma_1.prisma.location.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json(locations);
};
exports.listLocations = listLocations;
