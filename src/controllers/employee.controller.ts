import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const listAllEmployees = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const where = {
    role: "EMPLOYEE" as const,
  };

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { location: true },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    data,
    total,
    page,
    limit,
  });
};
