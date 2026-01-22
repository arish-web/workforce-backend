import jwt from "jsonwebtoken";

export const signAccessToken = (payload: object) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is missing");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "3h",
  });
};

export const signRefreshToken = (payload: object) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is missing");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
};
 

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
};