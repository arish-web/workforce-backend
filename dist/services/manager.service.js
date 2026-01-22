"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = getDashboardSummary;
exports.getEmployees = getEmployees;
exports.getTasks = getTasks;
exports.getTaskById = getTaskById;
exports.createTask = createTask;
const prisma_1 = require("../config/prisma");
/* ================= DASHBOARD ================= */
async function getDashboardSummary(managerId) {
    const locations = await prisma_1.prisma.location.findMany({
        where: { managerId },
        select: { id: true },
    });
    const locationIds = locations.map(l => l.id);
    const [teamCount, pending, inProgress, completed, overdue] = await Promise.all([
        prisma_1.prisma.user.count({
            where: {
                role: "EMPLOYEE",
                locationId: { in: locationIds },
            },
        }),
        prisma_1.prisma.task.count({
            where: { status: "PENDING", locationId: { in: locationIds } },
        }),
        prisma_1.prisma.task.count({
            where: { status: "IN_PROGRESS", locationId: { in: locationIds } },
        }),
        prisma_1.prisma.task.count({
            where: { status: "COMPLETED", locationId: { in: locationIds } },
        }),
        prisma_1.prisma.task.count({
            where: { status: "OVERDUE", locationId: { in: locationIds } },
        }),
    ]);
    return { teamCount, pending, inProgress, completed, overdue };
}
/* ================= EMPLOYEES ================= */
async function getEmployees(managerId) {
    const locations = await prisma_1.prisma.location.findMany({
        where: { managerId },
        select: { id: true },
    });
    const locationIds = locations.map(l => l.id);
    return prisma_1.prisma.user.findMany({
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
async function getTasks(managerId) {
    return prisma_1.prisma.task.findMany({
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
async function getTaskById(managerId, taskId) {
    const task = await prisma_1.prisma.task.findFirst({
        where: {
            id: taskId,
            location: { managerId },
        },
        include: {
            comments: true,
        },
    });
    if (!task)
        throw new Error("Task not found");
    return task;
}
async function createTask(managerId, payload) {
    // ensure employee belongs to manager’s location
    const employee = await prisma_1.prisma.user.findFirst({
        where: {
            id: payload.employeeId,
            role: "EMPLOYEE",
            location: {
                managerId,
            },
        },
    });
    if (!employee)
        throw new Error("Invalid employee");
    await prisma_1.prisma.task.create({
        data: {
            title: payload.title,
            deadline: new Date(payload.deadline),
            assignedToId: payload.employeeId,
            locationId: employee.locationId,
            status: "PENDING",
        },
    });
}
