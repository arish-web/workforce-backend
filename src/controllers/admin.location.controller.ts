import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const createLocation = async (req: Request, res: Response) => {
  const { name } = req.body;

  const location = await prisma.location.create({
    data: { name },
  });

  res.status(201).json(location);
};

export const listLocations = async (_req: Request, res: Response) => {
  const locations = await prisma.location.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(locations);
};
