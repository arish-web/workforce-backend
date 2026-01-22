import { Request, Response } from "express";
import { prisma } from "../config/prisma";


/* ================= GET TASKS ================= */

export const getManagerTasks = async (req: Request, res: Response) => {
  const tasks = await (prisma.task as any).findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const response = tasks.map((t: any) => ({
    id: t.id,
    title: t.title,
    employeeName: t.employeeName || "Unassigned",
    status: t.status,
    deadline: t.deadline,
  }));

  res.json(response);
};

/* ================= CREATE TASK ================= */

export const createManagerTask = async (req: Request, res: Response) => {
  const { title, deadline } = req.body;
  console.log("req.body",    req.body)

  if (!title || !deadline) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const task = await (prisma.task as any).create({
    data: {
      title,
      deadline: new Date(deadline),
      status: "PENDING",

      // TEMP fields for demo (safe)
      employeeName: req.body.employeeName || "Unassigned",
    },
  });

  res.status(201).json(task);
};

export const getManagerEmployees = async (_req: Request, res: Response) => {
  const employees = await prisma.user.findMany({
    where: {
      role: "EMPLOYEE",
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  // ALWAYS return array
  res.json(employees);
};
