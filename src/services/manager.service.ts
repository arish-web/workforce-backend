import { prisma } from "../config/prisma";

/* ================= DASHBOARD ================= */

export async function getDashboardSummary(managerId: string) {
  const locations = await prisma.location.findMany({
    where: { managerId },
    select: { id: true },
  });

  const locationIds = locations.map(l => l.id);

  const [teamCount, pending, inProgress, completed, overdue] =
    await Promise.all([
      prisma.user.count({
        where: {
          role: "EMPLOYEE",
          locationId: { in: locationIds },
        },
      }),
      prisma.task.count({
        where: { status: "PENDING", locationId: { in: locationIds } },
      }),
      prisma.task.count({
        where: { status: "IN_PROGRESS", locationId: { in: locationIds } },
      }),
      prisma.task.count({
        where: { status: "COMPLETED", locationId: { in: locationIds } },
      }),
      prisma.task.count({
        where: { status: "OVERDUE", locationId: { in: locationIds } },
      }),
    ]);

  return { teamCount, pending, inProgress, completed, overdue };
}

/* ================= EMPLOYEES ================= */

export async function getEmployees(managerId: string) {
  const locations = await prisma.location.findMany({
    where: { managerId },
    select: { id: true },
  });

  const locationIds = locations.map(l => l.id);

  return prisma.user.findMany({
    where: {
      role: "EMPLOYEE",
      locationId: { in: locationIds },
    },
    select: {
      id: true,
      email: true,
      isActive: true,
      locationId: true,
    },
  });
}

/* ================= TASKS ================= */

export async function getTasks(managerId: string) {
  return prisma.task.findMany({
    where: {
      location: {
        managerId,
      },
    },
    include: {
      assignedTo: {
        select: { email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTaskById(managerId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      location: { managerId },
    },
    include: {
      comments: true,
    },
  });

  if (!task) throw new Error("Task not found");
  return task;
}

export async function createTask(
  managerId: string,
  payload: { title: string; employeeId: string; deadline: string }
) {
  // ensure employee belongs to manager’s location
  const employee = await prisma.user.findFirst({
    where: {
      id: payload.employeeId,
      role: "EMPLOYEE",
      location: {
        managerId,
      },
    },
  });

  if (!employee) throw new Error("Invalid employee");

  await prisma.task.create({
    data: {
      title: payload.title,
      deadline: new Date(payload.deadline),
      assignedToId: payload.employeeId,
      locationId: employee.locationId!,
      status: "PENDING",
    },
  });
}
