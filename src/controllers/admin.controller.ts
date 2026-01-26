import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

/* =====================================================
   EMPLOYEES
===================================================== */

/**
 * CREATE EMPLOYEE / MANAGER
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
      isActive: true,
    },
  });

  res.status(201).json(user);
};

/**
 * LIST EMPLOYEES (PAGINATION + FILTERS)
 */
export const listEmployees = async (req: Request, res: Response) => {
  const { role, location, status, page = "1", limit = "10" } = req.query;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 100);

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
 * ACTIVATE / DEACTIVATE EMPLOYEE
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

/* =====================================================
   LOCATIONS
===================================================== */

/**
 * CREATE LOCATION
 */
export const createLocation = async (req: Request, res: Response) => {
  const { name, managerId } = req.body;

  // ✅ get the ONLY organization
  const org = await prisma.organization.findFirst({
    where: { isActive: true },
  });

  if (!org) {
    return res.status(400).json({
      message: "No active organization found",
    });
  }

  const location = await prisma.location.create({
    data: {
      name,
      organizationId: org.id,
      managerId: managerId || null,
    },
  });

  res.status(201).json(location);
};

/**
 * LIST LOCATIONS
 */
export const listLocations = async (_req: Request, res: Response) => {
  const locations = await prisma.location.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(locations);
};



export const getAdminSummary = async (_req: Request, res: Response) => {
  try {
    const [
      totalEmployees,
      totalManagers,
      totalTasks,
    ] = await prisma.$transaction([
      prisma.user.count({
        where: { role: "EMPLOYEE", isActive: true },
      }),
      prisma.user.count({
        where: { role: "MANAGER", isActive: true },
      }),
      prisma.task.count(),
    ]);

    res.json({
      totalEmployees,
      totalManagers,
      totalTasks,
    });
  } catch (error) {
    console.error("ADMIN SUMMARY ERROR:", error);
    res.status(500).json({ message: "Failed to load admin summary" });
  }
};
