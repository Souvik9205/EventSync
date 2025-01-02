import { Router } from "express";
import {
  createEventController,
  getEventController,
} from "../controller/eventController";

const eventRouter = Router();

eventRouter.get("/:eventId", getEventController);
eventRouter.post("/create", createEventController);

export default eventRouter;
