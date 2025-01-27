"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, UserCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GITHUB_URL, PORTFOLIO_URL } from "../secret";

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <motion.a
    href={href}
    className="relative text-gray-600 hover:text-emerald-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 group"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    target="_blank"
  >
    {children}
    <motion.span
      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100"
      initial={false}
    />
  </motion.a>
);

const MobileNavLink: React.FC<{
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ href, children, onClick }) => (
  <motion.a
    href={href}
    className="block px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md"
    onClick={onClick}
    target="_blank"
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.a>
);

const Navbar: React.FC = () => {
  const [hasToken, setHasToken] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    setIsHomePage(window.location.pathname === "/");
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <motion.header
      className={`sticky top-0 z-[99] transition-all duration-300
       bg-white/80 backdrop-blur-md shadow-lg
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
                className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <QrCode className="h-10 w-10 text-emerald-600 relative" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              EventSync
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <AnimatePresence mode="wait">
              <motion.div
                className="flex items-center space-x-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <NavLink href={GITHUB_URL}>Contribute</NavLink>
                <NavLink href={PORTFOLIO_URL}>About Me</NavLink>

                {!hasToken && (
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-colors duration-200"
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
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-colors duration-200"
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
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200" />
                    <Button
                      className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
                )}
              </motion.div>
            </AnimatePresence>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pt-2 pb-4 space-y-2 bg-white shadow-lg">
              <MobileNavLink href={GITHUB_URL} onClick={closeMobileMenu}>
                Contribute
              </MobileNavLink>
              <MobileNavLink href={PORTFOLIO_URL} onClick={closeMobileMenu}>
                About Me
              </MobileNavLink>

              {!hasToken && (
                <div className="space-y-2 pt-2">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                    onClick={() => {
                      closeMobileMenu();
                      window.location.href = "/auth/login";
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                    onClick={() => {
                      closeMobileMenu();
                      window.location.href = "/auth/signup";
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {isHomePage && (
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  onClick={() => {
                    closeMobileMenu();
                    window.location.href = "/home";
                  }}
                >
                  Get Started
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
