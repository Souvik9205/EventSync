import { Request, Response } from "express";
import { SignupOTPService } from "../survice/otpVerify";

export const SignupOTPVerifyController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    res.status(400).json({ message: "OTP and email are required" });
    return;
  }
  try {
    const result = await SignupOTPService(otp, email);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Signup OTP Verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
