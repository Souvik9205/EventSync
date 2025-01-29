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

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );
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

// export const forgetPasswordService = async (email: string): Promise<any> => {
//   try {
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       // return NextResponse.json(
//       //   { message: "If the email exists, a reset link will be sent" },
//       //   { status: 200 }
//       // );
//       return {
//         status: 200,
//         message: "If the email exists, a reset link will be sent",
//       };
//     }

//     const token = uuidv4();
//     const expiresAt = new Date(Date.now() + 3600000); // 1 hour

//     await prisma.passwordResetToken.create({
//       data: {
//         userId: user.id,
//         token,
//         expiresAt,
//       },
//     });

//     const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
//     await EmailSent({
//       email,
//       subject: "Password Reset Request",
//       html: `Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.`,
//     });

//     return NextResponse.json(
//       { message: "Password reset link sent to email" },
//       { status: 200 }
//     );
//   } catch (error) {
//     return {
//       status: 500,
//       data: {
//         message: `Internal server error, ${error}`,
//         token: "",
//       },
//     };
//   }
// };
// function uuidv4() {
//   throw new Error("Function not implemented.");
// }
