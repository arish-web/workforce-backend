import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getLocations = async (req: Request, res: Response) => {
  const locations = await prisma.location.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(locations);
};
