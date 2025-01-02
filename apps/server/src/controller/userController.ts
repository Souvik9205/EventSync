import { Request, Response } from "express";
import { getUser, getUserEvents, updateUser } from "../survice/user";

export const getUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const result = await getUser(token);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserEventsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const result = await getUserEvents(token);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { name, imgURL } = req.body;

  if (!name && !imgURL) {
    res.status(400).json({ message: "Name and imgURL are required" });
    return;
  }

  try {
    const result = await updateUser(token, name, imgURL);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
