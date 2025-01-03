import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_ACCESS_TOKEN } from "./Secret";

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_ACCESS_TOKEN as string, { expiresIn: "30m" });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET as string, { expiresIn: "7d" });
};
