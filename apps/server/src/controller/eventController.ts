import { Request, Response } from "express";
import { createEvent, getEvent, getUserEvent } from "../survice/event";

export const getEventController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { eventId } = req.params;
  if (!eventId || eventId === "") {
    res.status(400).json({ message: "Event ID is required" });
    return;
  }
  try {
    const result = await getEvent(token, eventId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createEventController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const {
    name,
    description,
    organization,
    eventDate,
    location,
    orgImgURL,
    eventTime,
    customFields,
    tickets,
  } = req.body;
  if (
    !name ||
    !organization ||
    !eventDate ||
    !location ||
    !orgImgURL ||
    !eventTime
  ) {
    res.status(400).json({
      message:
        "All required fields (name, organization, dateTime, location) must be provided.",
    });
    return;
  }
  const data = {
    name,
    description,
    organization,
    eventDate,
    location,
    orgImgURL,
    eventTime,
    customFields,
    tickets,
  };
  try {
    const result = await createEvent(token, data);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserEventController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { eventId } = req.params;
  if (!eventId || eventId === "") {
    res.status(400).json({ message: "Event ID is required" });
    return;
  }
  try {
    const result = await getUserEvent(eventId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
