import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QrCode, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <motion.a
    href={href}
    className="relative text-gray-600 hover:text-emerald-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 group"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
    <motion.span
      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100"
      initial={false}
    />
  </motion.a>
);

const EventNavbar: React.FC = () => {
  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md shadow-lg}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3 group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/")}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <QrCode className="h-8 w-8 text-emerald-600 relative" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              AttendSync
            </span>
          </motion.div>

          {/* Right Section - Navigation */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink href="/docs">Docs</NavLink>
              <NavLink href="/support">Support</NavLink>
            </nav>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
              onClick={() => (window.location.href = "/home")}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-200" />
              <Button
                variant="ghost"
                className="relative p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors duration-200"
              >
                <UserCircle className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default EventNavbar;
