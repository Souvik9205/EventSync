import { Request, Response } from "express";
import { scanEvent, verifedAttendance } from "../survice/scan";

export const ScanEventController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { eventId, attendanceId } = req.body;
  if (!eventId || !attendanceId) {
    res
      .status(400)
      .json({
        message: "Event and Attendance Id are required",
        data: req.body,
      });
    return;
  }
  try {
    const result = await scanEvent(attendanceId, eventId);
    res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Get Scan Error:", err);
    res.status(500).json({ message: "server error" });
  }
};

export const VerifiedAttendanceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { eventId, attendanceId } = req.body;
  if (!eventId || !attendanceId) {
    res.status(400).json({ message: "Event and Attendance Id are required" });
    return;
  }
  try {
    const result = await verifedAttendance(attendanceId, eventId, token);
    res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Get Scan Error:", err);
    res.status(500).json({ message: "server error" });
  }
};
