import { Router } from "express";
import {
  getUserController,
  getUserEventsController,
  getUserRegisterEventsController,
  updateUserController,
} from "../controller/userController";
const userRouter = Router();

userRouter.get("/", getUserController);
userRouter.get("/events", getUserEventsController);
userRouter.post("/update", updateUserController);
userRouter.get("/registered/events", getUserRegisterEventsController);

export default userRouter;
