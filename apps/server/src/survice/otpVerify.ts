import { SignUpResponse } from "../types";
import prisma from "../utils/PrismaClient";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/Secret";

export const SignupOTPService = async (
  otp: string,
  email: string
): Promise<SignUpResponse> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return {
        status: 409,
        data: {
          message: "User already exists",
          user: {
            id: "",
            createdAt: "",
          },
          token: "",
        },
      };
    }
    const existingOtp = await prisma.otp.findFirst({
      where: {
        user: email,
      },
    });

    if (!existingOtp) {
      return {
        status: 404,
        data: {
          message: "OTP not found",
          user: {
            id: "",
            createdAt: "",
          },
          token: "",
        },
      };
    }

    if (existingOtp.otp !== otp || existingOtp.expiresAt < new Date()) {
      return {
        status: 400,
        data: {
          message: "Invalid OTP or OTP has expired",
          user: {
            id: "",
            createdAt: "",
          },
          token: "",
        },
      };
    }
    const otpData = existingOtp.data as {
      password?: string;
      name?: string;
    };

    if (!otpData || !otpData.password || !otpData.name) {
      return {
        status: 400,
        data: {
          message: "Invalid OTP data",
          user: { id: "", createdAt: "" },
          token: "",
        },
      };
    }
    const newUser = await prisma.user.create({
      data: {
        email,
        password: otpData.password,
        name: otpData.name,
      },
    });

    await prisma.otp.delete({
      where: {
        id: existingOtp.id,
      },
    });
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    return {
      status: 200,
      data: {
        message: "User registered successfully",
        user: {
          id: newUser.id,
          createdAt: newUser.createdAt.toISOString(),
        },
        token: token,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      data: {
        message: "Internal server error",
        user: {
          id: "",
          createdAt: "",
        },
        token: "",
      },
    };
  }
};
