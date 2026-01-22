// import { prisma } from "../config/prisma";

// export const createOrg = async (req: Request, res: Response) => {
//   const { name } = req.body;
//   const org = await prisma.organization.create({ data: { name } });
//   res.json(org);
// };

// export const listOrgs = async (req: Request, res: Response) => {
//   const { page = 1, limit = 10, search = "" } = req.query;

//   const [data, total] = await prisma.$transaction([
//     prisma.organization.findMany({
//       where: {
//         deletedAt: null,
//         name: { contains: String(search), mode: "insensitive" },
//       },
//       skip: (page - 1) * limit,
//       take: Number(limit),
//     }),
//     prisma.organization.count({ where: { deletedAt: null } }),
//   ]);

//   res.json({ data, total });
// };

// export const deleteOrg = async (req: Request, res: Response) => {
//   await prisma.organization.update({
//     where: { id: req.params.id },
//     data: { deletedAt: new Date() },
//   });
//   res.json({ success: true });
// };
