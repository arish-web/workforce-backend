import { Request, Response } from "express";
import { loginUser } from "./auth.service";
import { loginSchema } from "./auth.schema";

export async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);
  const data = await loginUser(body.email, body.password);
  res.json(data);
}
