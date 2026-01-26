// import { Request, Response } from "express";
// import { prisma } from "../config/prisma";

// export const listAllEmployees = async (req: Request, res: Response) => {
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;

//   const skip = (page - 1) * limit;

//   const where = {
//     role: "EMPLOYEE" as const,
//   };

//   const [data, total] = await prisma.$transaction([
//     prisma.user.findMany({
//       where,
//       skip,
//       take: limit,
//       orderBy: { createdAt: "desc" },
//       include: { location: true },
//     }),
//     prisma.user.count({ where }),
//   ]);

//   res.json({
//     data,
//     total,
//     page,
//     limit,
//   });
// };


// src/controllers/employee.controller.ts
import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getMyTasks = async (req: any, res: Response) => {
  try {
    const employeeId = req.user.userId;

    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: employeeId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      data: tasks,
    });
  } catch (err) {
    console.error("GET MY TASKS ERROR", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const updateMyTaskStatus = async (req: any, res: Response) => {
  try {
    const employeeId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.updateMany({
      where: {
        id,
        assignedToId: employeeId, // 🔒 ownership check
      },
      data: {
        status,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE TASK STATUS ERROR", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};
