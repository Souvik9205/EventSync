import { Router } from "express";
import {
  loginController,
  signupController,
  tokenVerifyController,
} from "../controller/authController";
const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/signup", signupController);
authRouter.get("/validate-token", tokenVerifyController);

export default authRouter;
