import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BACKEND_URL } from "../secret";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion } from "framer-motion";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, email }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const otpForm = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .length(6, "OTP must be exactly 6 digits")
        .matches(/^[0-9]+$/, "OTP must be numeric")
        .required("Required"),
    }),
    onSubmit: async (value) => {
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/otp/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: value.otp,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          localStorage.setItem("token", data.token);
          toast.success("Signup Successful", {
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
          toast.error("OTP Verification Failed", { description: data.message });
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to verify OTP. Please try again.");
      } finally {
        setLoading(false);
        onClose();
      }
    },
  });

  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 h-screen w-screen z-50 flex items-center justify-center bg-black/70">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-gray-600 w-80 p-6"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-3xl mb-1 font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Enter OTP
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            We've sent a 6-digit OTP to your email. Please enter it below to
            verify your account.
          </p>
        </motion.div>
        <form
          onSubmit={otpForm.handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => {
              setValue(value);
              otpForm.setFieldValue("otp", value);
            }}
            className=""
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {otpForm.touched.otp && otpForm.errors.otp ? (
            <div className="text-red-500 text-sm mt-1">
              {otpForm.errors.otp}
            </div>
          ) : null}
          <div className="flex justify-end gap-4">
            <Button
              className="hover:bg-gray-50"
              type="button"
              variant={"outline"}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit OTP"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPModal;
