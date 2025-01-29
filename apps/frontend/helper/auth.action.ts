"use server";

import { BACKEND_URL } from "@/app/secret";

export const loginAction = async (values: {
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL || BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    const data = await response.json();

    if (response.status !== 200) {
      throw new Error(data.message || "Login failed. Please try again.");
    }

    return {
      success: true,
      token: data.token,
      message: "Login successful.",
    };
  } catch (e) {
    return {
      success: false,
      message: `${e}.message` || "An unknown error occurred.",
    };
  }
};

export const SignUpAction = async (values: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL || BACKEND_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    const data = await response.json();

    if (response.status !== 200 || 201) {
      throw new Error(data.message || "Signup failed. Please try again.");
    }

    return {
      success: true,
      message: "OTP send successful.",
    };
  } catch (e) {
    return {
      success: false,
      message: `${e}.message` || "An unknown error occurred.",
    };
  }
};
