import { hash, compare } from "../script";
import prisma from "../utils/PrismaClient";
import jwt from "jsonwebtoken";
import { LoginResponse, SignUpResponse } from "../types";
import { JWT_SECRET } from "../utils/Secret";

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
      expiresIn: "1d",
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
        message: "Internal server error",
        token: "",
      },
    };
  }
};

export const signUpService = async (
  email: string,
  password: string,
  name: string
): Promise<SignUpResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
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

    const hashedPassword = await hash(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET as string, {
      expiresIn: "1d",
    });
    return {
      status: 201,
      data: {
        message: "User created successfully",
        user: {
          id: newUser.id,
          createdAt: newUser.createdAt.toLocaleString(),
        },
        token,
      },
    };
  } catch (error) {
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
