import { Request, Response } from "express";
import { getAttendence, registerService } from "../survice/attendence";

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { eventId, data } = req.body;
  const userId = req.headers.authorization?.split(" ")[1];
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!eventId || !data) {
    res.status(400).json({ message: "Event ID and data are required" });
    return;
  }
  try {
    const result = await registerService(userId, eventId, data);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAttendenceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { eventId } = req.params;
  const userId = req.headers.authorization?.split(" ")[1];
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!eventId || eventId === "") {
    res.status(400).json({ message: "Event ID is required" });
    return;
  }
  try {
    const result = await getAttendence(userId, eventId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
