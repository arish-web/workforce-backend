"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLocations = exports.createLocation = void 0;
const prisma_1 = require("../config/prisma");
const createLocation = async (req, res) => {
    const { name } = req.body;
    const location = await prisma_1.prisma.location.create({
        data: { name },
    });
    res.status(201).json(location);
};
exports.createLocation = createLocation;
const listLocations = async (_req, res) => {
    const locations = await prisma_1.prisma.location.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json(locations);
};
exports.listLocations = listLocations;
