"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagerEmployees = exports.createManagerTask = exports.getManagerDashboardSummary = exports.getManagerTasks = void 0;
const prisma_1 = require("../config/prisma");
/* ================= GET TASKS ================= */
const getManagerTasks = async (req, res) => {
    try {
        const managerId = req.user.userId;
        const tasks = await prisma_1.prisma.task.findMany({
            where: { managerId },
            include: {
                assignedTo: {
                    select: { id: true, email: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return res.json(tasks.map((t) => ({
            id: t.id,
            title: t.title,
            status: t.status,
            priority: t.priority,
            dueDate: t.dueDate,
            assignedTo: t.assignedTo,
        })));
    }
    catch (err) {
        console.error("GET MANAGER TASKS ERROR:", err);
        return res.status(500).json({ message: "Failed to fetch tasks" });
    }
};
exports.getManagerTasks = getManagerTasks;
const getManagerDashboardSummary = async (req, res) => {
    try {
        const managerId = req.user.userId;
        const tasks = await prisma_1.prisma.task.findMany({
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
            if (task.status === "PENDING")
                summary.pending++;
            if (task.status === "IN_PROGRESS")
                summary.inProgress++;
            if (task.status === "COMPLETED")
                summary.completed++;
            if (task.dueDate &&
                new Date(task.dueDate) < now &&
                task.status !== "COMPLETED") {
                summary.overdue++;
            }
        }
        return res.json(summary);
    }
    catch (err) {
        console.error("GET MANAGER DASHBOARD SUMMARY ERROR:", err);
        return res.status(500).json({ message: "Failed to load dashboard summary" });
    }
};
exports.getManagerDashboardSummary = getManagerDashboardSummary;
/* ================= CREATE TASK ================= */
const createManagerTask = async (req, res) => {
    try {
        const { title, dueDate, priority, assignedTo } = req.body;
        if (!title || !dueDate || !assignedTo) {
            return res.status(400).json({ message: "Missing fields" });
        }
        const task = await prisma_1.prisma.task.create({
            data: {
                title,
                dueDate: new Date(dueDate),
                priority: priority || "MEDIUM",
                status: "PENDING",
                managerId: req.user.userId,
                assignedToId: assignedTo,
            },
        });
        return res.status(201).json(task);
    }
    catch (err) {
        console.error("CREATE TASK ERROR:", err);
        return res.status(500).json({ message: "Failed to create task" });
    }
};
exports.createManagerTask = createManagerTask;
/* ================= EMPLOYEES ================= */
const getManagerEmployees = async (_req, res) => {
    try {
        const employees = await prisma_1.prisma.user.findMany({
            where: { role: "EMPLOYEE" },
            select: { id: true, email: true },
        });
        return res.json(employees);
    }
    catch (err) {
        return res.status(500).json({ message: "Failed to fetch employees" });
    }
};
exports.getManagerEmployees = getManagerEmployees;
