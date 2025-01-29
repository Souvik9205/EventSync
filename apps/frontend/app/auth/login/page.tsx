"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { loginAction } from "@/helper/auth.action";
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

    // const result = await loginAction(values);
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error("Login Failed", { description: result.message });
      setIsLoading(false);
      return;
    }

    toast.success(result.message, {
      description: "Redirecting to dashboard...",
    });
    localStorage.setItem("token", result.token);

    const redirectUrl = sessionStorage.getItem("redirect");
    window.location.href = redirectUrl || "/home";
    sessionStorage.removeItem("redirect");
    setIsLoading(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-200 via-white to-teal-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/80 shadow-2xl border-0">
          <CardHeader className="text-center space-y-2 pb-2">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <h1 className="text-3xl mb-1 font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-500">Sign in to continue to EventSync</p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-700 group-hover:text-emerald-500 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    {...formik.getFieldProps("email")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-white/50 backdrop-blur-sm
                      ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-500"
                          : "border-gray-300 hover:border-emerald-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                    placeholder="Enter your email"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {formik.errors.email}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-700 group-hover:text-emerald-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...formik.getFieldProps("password")}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg bg-white/50 backdrop-blur-sm
                      ${
                        formik.touched.password && formik.errors.password
                          ? "border-red-500"
                          : "border-gray-300 hover:border-emerald-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {formik.errors.password}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all duration-300 group"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <Link
                      href="/auth/signup"
                      className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
