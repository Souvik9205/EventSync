"use client";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

export function EventLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white flex items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-indigo-600 text-2xl"
      >
        <QrCode className="h-12 w-12" />
      </motion.div>
    </div>
  );
}
