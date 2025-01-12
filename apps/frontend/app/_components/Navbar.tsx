import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface NavbarProps {
  variant?: "default" | "auth" | "dashboard";
  onBack?: () => void;
}

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <motion.a
    href={href}
    className="text-indigo-700 hover:text-indigo-900 px-3 py-2 rounded-md text-sm font-medium"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.a>
);

const Navbar: React.FC<NavbarProps> = ({ variant = "default", onBack }) => {
  const isDefaultVariant = variant === "default";
  const isAuthVariant = variant === "auth";
  const isDashboardVariant = variant === "dashboard";

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="mx-10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="absolute top-5 left-5">
            <SidebarTrigger />
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <QrCode className="h-10 w-10 text-indigo-600" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
                AttendSync
              </span>
            </motion.div>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <AnimatePresence mode="wait">
              {isDefaultVariant && (
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavLink href="/features">Features</NavLink>
                  <NavLink href="/pricing">Pricing</NavLink>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="border-indigo-500 text-indigo-700 hover:bg-indigo-50"
                    >
                      Login
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-shadow duration-200">
                      Get Started
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {isAuthVariant && onBack && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-indigo-700 hover:bg-indigo-50"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back
                  </Button>
                </motion.div>
              )}

              {isDashboardVariant && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    className="text-indigo-700 hover:bg-indigo-50"
                  >
                    Home
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
