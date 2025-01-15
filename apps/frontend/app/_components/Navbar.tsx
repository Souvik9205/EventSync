import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <motion.a
    href={href}
    className="relative text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 group"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
    <motion.span
      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-indigo-700 transform scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100"
      initial={false}
    />
  </motion.a>
);

const Navbar: React.FC = () => {
  const [hasToken, setHasToken] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    setIsHomePage(window.location.pathname === "/");

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <motion.div
            className="flex items-center space-x-3 group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/")}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <QrCode className="h-10 w-10 text-indigo-600 relative" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
              AttendSync
            </span>
          </motion.div>

          {/* Navigation Section */}
          <nav className="hidden md:flex items-center space-x-6">
            <AnimatePresence mode="wait">
              <motion.div
                className="flex items-center space-x-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <NavLink href="/docs">Docs</NavLink>
                <NavLink href="/support">Support</NavLink>

                {!hasToken && (
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors duration-200"
                        onClick={() => (window.location.href = "/auth/login")}
                      >
                        Login
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors duration-200"
                        onClick={() => (window.location.href = "/auth/signup")}
                      >
                        Sign Up
                      </Button>
                    </motion.div>
                  </div>
                )}

                {isHomePage ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200" />
                    <Button
                      className="relative bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => (window.location.href = "/home")}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-200" />
                    <Button
                      variant="ghost"
                      className="relative p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                    >
                      <UserCircle className="h-6 w-6" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
