import { hash, compare } from "../script";
import prisma from "../utils/PrismaClient";
import jwt from "jsonwebtoken";
import { LoginResponse, SignUpResponse } from "../types";
import { JWT_SECRET } from "../utils/Secret";
import { EmailSent } from "../utils/Mailer";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
export const loginService = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        status: 404,
        data: {
          message: "User not found",
          token: "",
        },
      };
    }
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return {
        status: 401,
        data: {
          message: "Invalid credentials",
          token: "",
        },
      };
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
      expiresIn: "3d",
    });
    return {
      status: 200,
      data: {
        message: "Login successful",
        token,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: `Internal server error, ${error}`,
        token: "",
      },
    };
  }
};

export const signUpService = async (
  email: string,
  password: string,
  name: string
): Promise<{
  status: number;
  message: string;
}> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        status: 409,
        message: "User already exists",
      };
    }
    const hashedPassword = await hash(password);
    const OTP = generateOtp();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    const existingOtp = await prisma.otp.findFirst({
      where: {
        user: email,
        type: "UserOtp",
      },
    });
    if (existingOtp) {
      await prisma.otp.update({
        where: {
          id: existingOtp.id,
          type: "UserOtp",
        },
        data: {
          otp: OTP,
          data: {
            password: hashedPassword,
            name: name,
          },
          expiresAt: otpExpiry,
        },
      });

      const emailSent = await EmailSent(email, OTP, "UserOtp", null);
      if (!emailSent) {
        return {
          status: 400,
          message: "Error sending email",
        };
      }
      return {
        status: 201,
        message: "OTP updated successfully",
      };
    }
    await prisma.otp.create({
      data: {
        user: email,
        otp: OTP,
        data: {
          password: hashedPassword,
          name: name,
        },
        expiresAt: otpExpiry,
        type: "UserOtp",
      },
    });
    const emailSent = await EmailSent(email, OTP, "UserOtp", null);
    if (!emailSent) {
      return {
        status: 400,
        message: "Error sending email",
      };
    }
    return {
      status: 201,
      message: "OTP sent successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: `Internal server error, ${error}`,
    };
  }
};
