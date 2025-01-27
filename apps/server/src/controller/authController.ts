import { Request, Response } from "express";
import { loginService, signUpService } from "../survice/auth";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/Secret";

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const result = await loginService(email, password);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signupController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: "Email, password, and name are required" });
    return;
  }

  try {
    const result = await signUpService(email, password, name);
    res.status(result.status).json(result.message);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const tokenVerifyController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ valid: false, message: "No token provided" });
  }

  try {
    jwt.verify(token, JWT_SECRET); // Verifies token health
    res.json({ valid: true });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
};
