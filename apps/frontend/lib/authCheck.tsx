"use client";
import { BACKEND_URL } from "@/app/secret";
import { useEffect } from "react";

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/validate-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const tokenData = await response.json();
    return tokenData.valid;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};

export const useAuthCheck = () => {
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/login";
        return;
      }

      const isTokenValid = await validateToken(token);

      if (!isTokenValid) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
    };

    checkAuth();
  }, []);
};
