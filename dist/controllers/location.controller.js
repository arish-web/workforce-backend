"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocations = void 0;
const prisma_1 = require("../config/prisma");
const getLocations = async (req, res) => {
    const locations = await prisma_1.prisma.location.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json(locations);
};
exports.getLocations = getLocations;
