import { Router } from "express";
import {
  registerController,
  getAttendenceController,
} from "../controller/attendenceController";
const registerRouter = Router();

registerRouter.post("/register", registerController);
registerRouter.get("/attendence/:eventId", getAttendenceController);

export default registerRouter;
