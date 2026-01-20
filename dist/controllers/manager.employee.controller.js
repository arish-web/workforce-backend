"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagerEmployees = void 0;
const prisma_1 = require("../config/prisma");
// export const getManagerEmployees = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   const managerId = req.user!.userId;
//   // pagination params
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;
//   const skip = (page - 1) * limit;
//   // fetch manager
//   const manager = await prisma.user.findUnique({
//     where: { id: managerId },
//     select: { locationId: true },
//   });
//   // no location → no employees
//   if (!manager?.locationId) {
//     return res.json({
//       data: [],
//       total: 0,
//       page,
//       limit,
//     });
//   }
//   const where = {
//     role: "EMPLOYEE" as const,
//     locationId: manager.locationId,
//   };
//   // paginated fetch + count
//   const [data, total] = await prisma.$transaction([
//     prisma.user.findMany({
//       where,
//       skip,
//       take: limit,
//       include: { location: true },
//       orderBy: { createdAt: "desc" },
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
const getManagerEmployees = async (req, res) => {
    const { status, page = "1", limit = "10" } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const where = {
        role: "EMPLOYEE", // 🔒 only constraint left
        isActive: status === "active"
            ? true
            : status === "inactive"
                ? false
                : undefined,
    };
    const [data, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.user.findMany({
            where,
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            orderBy: { createdAt: "desc" },
            include: { location: true },
        }),
        prisma_1.prisma.user.count({ where }),
    ]);
    res.json({
        data,
        total,
        page: pageNum,
        limit: limitNum,
    });
};
exports.getManagerEmployees = getManagerEmployees;
