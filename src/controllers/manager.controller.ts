import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

/* ================= GET TASKS ================= */

// export const getManagerTasks = async (req: AuthRequest, res: Response) => {
//   try {
//     const managerId = req.user!.userId;

//     const tasks = await prisma.task.findMany({
//       where: { managerId } as any,
//       include: {
//         assignedTo: {
//           select: { id: true, email: true },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return res.json(
//       tasks.map((t: any) => ({
//         id: t.id,
//         title: t.title,
//         status: t.status,
//         priority: t.priority,
//         dueDate: t.dueDate,
//         assignedTo: t.assignedTo,
//       })),
//     );
//   } catch (err) {
//     console.error("GET MANAGER TASKS ERROR:", err);
//     return res.status(500).json({ message: "Failed to fetch tasks" });
//   }
// };


export const getManagerTasks = async (req: AuthRequest, res: Response) => {
  try {
    const managerId = req.user!.userId;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const status = req.query.status as string | undefined;

    // ✅ FIX: include status when provided
    const where: any = {
      managerId,
      ...(status ? { status } : {}),
    };

    // ✅ total MUST respect filters
    const total = await prisma.task.count({ where });

    const tasks = await prisma.task.findMany({
      where,
      skip,
      take: limit,
      include: {
        assignedTo: {
          select: { id: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      data: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        assignedTo: t.assignedTo,
      })),
      page,
      limit,
      total,
    });
  } catch (err) {
    console.error("GET MANAGER TASKS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};


export const getManagerDashboardSummary = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const managerId = req.user!.userId;

    const tasks = await prisma.task.findMany({
      where: { managerId },
      select: {
        status: true,
        dueDate: true,
      },
    });

    const now = new Date();

    const summary = {
      totalTasks: tasks.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
    };

    for (const task of tasks) {
      if (task.status === "PENDING") summary.pending++;
      if (task.status === "IN_PROGRESS") summary.inProgress++;
      if (task.status === "COMPLETED") summary.completed++;

      if (
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== "COMPLETED"
      ) {
        summary.overdue++;
      }
    }

    return res.json(summary);
  } catch (err) {
    console.error("GET MANAGER DASHBOARD SUMMARY ERROR:", err);
    return res.status(500).json({ message: "Failed to load dashboard summary" });
  }
};

/* ================= CREATE TASK ================= */

export const createManagerTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, dueDate, priority, assignedTo } = req.body;

    if (!title || !dueDate || !assignedTo) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        priority: priority || "MEDIUM",
        status: "PENDING",
        managerId: req.user!.userId,
        assignedToId: assignedTo,
      } as any,
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    return res.status(500).json({ message: "Failed to create task" });
  }
};

/* ================= EMPLOYEES ================= */

export const getManagerEmployees = async (_req: AuthRequest, res: Response) => {
  try {
    const employees = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      select: { id: true, email: true },
    });

    return res.json(employees);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch employees" });
  }
};
