"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLocations = exports.createLocation = void 0;
const prisma_1 = require("../config/prisma");
const createLocation = async (_req, res) => {
    const { name, organizationId, managerId } = _req.body;
    if (!organizationId) {
        return res.status(400).json({ message: "organizationId is required" });
    }
    const location = await prisma_1.prisma.location.create({
        data: {
            name,
            organizationId, // ✅ REQUIRED
            managerId: managerId || null,
        },
    });
    res.json(location);
};
exports.createLocation = createLocation;
const listLocations = async (_req, res) => {
    const locations = await prisma_1.prisma.location.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json(locations);
};
exports.listLocations = listLocations;
