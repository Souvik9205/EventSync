import { JWT_ACCESS_TOKEN, JWT_SECRET } from "./Secret";
import jwt from "jsonwebtoken";

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_ACCESS_TOKEN, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
