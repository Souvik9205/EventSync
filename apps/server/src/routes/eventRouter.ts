import { Router } from "express";
import {
  createEventController,
  getEventAttendenceController,
  getEventController,
  getEventFieldsController,
  GetReviewController,
  getUserEventController,
} from "../controller/eventController";

const eventRouter = Router();

eventRouter.get("/:eventId", getEventController);
eventRouter.post("/create", createEventController);
eventRouter.get("/user/:eventId", getUserEventController);
eventRouter.post("/review", GetReviewController);
eventRouter.get("/fields/:eventId", getEventFieldsController);
eventRouter.get("/attendence/:eventId", getEventAttendenceController);

export default eventRouter;
