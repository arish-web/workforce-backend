"use strict";
// import { Request, Response } from "express";
// import { prisma } from "../config/prisma";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyTaskStatus = exports.getMyTasks = void 0;
const prisma_1 = require("../config/prisma");
const getMyTasks = async (req, res) => {
    try {
        const employeeId = req.user.userId;
        const tasks = await prisma_1.prisma.task.findMany({
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
    }
    catch (err) {
        console.error("GET MY TASKS ERROR", err);
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};
exports.getMyTasks = getMyTasks;
const updateMyTaskStatus = async (req, res) => {
    try {
        const employeeId = req.user.userId;
        const { id } = req.params;
        const { status } = req.body;
        const task = await prisma_1.prisma.task.updateMany({
            where: {
                id,
                assignedToId: employeeId, // 🔒 ownership check
            },
            data: {
                status,
            },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error("UPDATE TASK STATUS ERROR", err);
        res.status(500).json({ message: "Failed to update task" });
    }
};
exports.updateMyTaskStatus = updateMyTaskStatus;
