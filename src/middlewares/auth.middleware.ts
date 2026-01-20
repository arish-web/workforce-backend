// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export interface AuthRequest extends Request {
//   user?: { userId: string; role: string };
// }

// export function requireAuth(roles: string[] = []) {
//   return (req: AuthRequest, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

//     const token = authHeader.split(" ")[1];

//     try {
//       const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;

//       if (roles.length && !roles.includes(payload.role)) {
//         return res.status(403).json({ message: "Forbidden" });
//       }

//       req.user = payload;
//       next();
//     } catch {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//   };
// }

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Extended request type to attach authenticated user
 */
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

/**
 * Role-based authentication middleware
 * @param roles Allowed roles (empty array = any authenticated user)
 */
export const requireAuth =
  (roles: string[] = []) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check token presence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      // 2️⃣ Verify JWT
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload & { userId: string; role: string };

      // 3️⃣ Role-based access check (if roles provided)
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // 4️⃣ Attach user to request
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

