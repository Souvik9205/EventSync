import { Router } from "express";
import {
  createEventController,
  getEventController,
  GetReviewController,
  getUserEventController,
} from "../controller/eventController";

const eventRouter = Router();

eventRouter.get("/:eventId", getEventController);
eventRouter.post("/create", createEventController);
eventRouter.get("/user/:eventId", getUserEventController);
eventRouter.post("/review", GetReviewController);

export default eventRouter;
