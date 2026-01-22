import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

/**
 * CREATE EMPLOYEE
 */
export const createEmployee = async (req: Request, res: Response) => {
  const { email, password, role, locationId } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: String(email),
      password: hashedPassword,
      role: role as Role,
      locationId: locationId ? String(locationId) : null,
    },
  });

  res.status(201).json(user);
};


export const listEmployees = async (req: Request, res: Response) => {
  const { role, location, status, page = "1", limit = "10" } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const where: any = {
    role: role || undefined,
    locationId: location || undefined,
    isActive:
      status === "active"
        ? true
        : status === "inactive"
        ? false
        : undefined,
  };

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { createdAt: "desc" },
      include: { location: true },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    data,
    total,
    page: pageNum,
    limit: limitNum,
  });
};

/**
 * UPDATE ROLE / LOCATION
 */
export const updateEmployee = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const { role, locationId } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(role && { role }),
      locationId: locationId === "" ? null : locationId,
    },
  });

  res.json(user);
};

/**
 * ACTIVATE / DEACTIVATE
 */
export const toggleEmployeeStatus = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { isActive } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: {
      isActive: Boolean(isActive),
    },
  });

  res.json(user);
};
