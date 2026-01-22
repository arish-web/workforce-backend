import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const createLocation = async (_req: Request, res: Response) => {
  const { name, organizationId, managerId } = _req.body;

  if (!organizationId) {
    return res.status(400).json({ message: "organizationId is required" });
  }

  const location = await prisma.location.create({
    data: {
      name,
      organizationId,      // ✅ REQUIRED
      managerId: managerId || null,
    },
  });

  res.json(location);
};


export const listLocations = async (_req: Request, res: Response) => {
  const locations = await prisma.location.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(locations);
};
