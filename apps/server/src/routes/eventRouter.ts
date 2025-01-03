import { Router } from "express";
import {
  createEventController,
  getEventController,
  getUserEventController,
} from "../controller/eventController";

const eventRouter = Router();

eventRouter.get("/:eventId", getEventController);
eventRouter.post("/create", createEventController);
eventRouter.get("/user/:eventId", getUserEventController);

export default eventRouter;
