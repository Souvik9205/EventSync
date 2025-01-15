import { Router } from "express";
import { SignupOTPVerifyController } from "../controller/otpVerifyController";
const OTPVerifyRouter = Router();

OTPVerifyRouter.post("/auth", SignupOTPVerifyController);

export default OTPVerifyRouter;
