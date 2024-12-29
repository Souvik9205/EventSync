import { Router } from "express";
import {
  loginController,
  signupController,
} from "../controller/authController";
const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/signup", signupController);

export default authRouter;
