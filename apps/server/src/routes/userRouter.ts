import { Router } from "express";
import {
  getUserController,
  getUserEventsController,
  updateUserController,
} from "../controller/userController";
const userRouter = Router();

userRouter.get("/", getUserController);
userRouter.get("/events", getUserEventsController);
userRouter.post("/update", updateUserController);

export default userRouter;
