"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { BACKEND_URL } from "@/app/secret";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        toast.success("Login Successful", {
          description: "Redirecting to dashboard...",
        });

        const redirectUrl = sessionStorage.getItem("redirect");
        if (redirectUrl) {
          window.location.href = redirectUrl;
          sessionStorage.removeItem("redirectUrl");
        } else {
          window.location.href = "/home";
        }
      } else {
        toast.error("Login Failed", {
          description: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      toast.error("Network Error", {
        description: "Unable to connect to server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500">Sign in to continue to AttendSync</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 
                           text-gray-400"
              />
              <input
                id="email"
                type="email"
                {...formik.getFieldProps("email")}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg 
                  ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter your email"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 
                           text-gray-400"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg 
                  ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 
                           text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
