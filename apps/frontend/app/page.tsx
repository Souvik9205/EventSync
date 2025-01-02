"use client";
import React, { useState } from "react";
import {
  QrCode,
  Smartphone,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const AttendanceLandingPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const router = useRouter();

  const features = [
    {
      icon: QrCode,
      title: "Instant QR Scanning",
      description:
        "Effortlessly track attendance with a single scan, eliminating manual entry and reducing errors.",
      color: "bg-indigo-50",
    },
    {
      icon: Users,
      title: "Comprehensive Tracking",
      description:
        "Monitor attendance across multiple venues, departments, and event types seamlessly.",
      color: "bg-teal-50",
    },
    {
      icon: CheckCircle,
      title: "Advanced Analytics",
      description:
        "Gain deep insights with real-time reporting and detailed attendance visualizations.",
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white">
      {/* Gradient Background Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <QrCode className="h-10 w-10 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-800">
              AttendSync
            </span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-indigo-700 hover:bg-indigo-50"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="text-indigo-700 hover:bg-indigo-50"
            >
              Pricing
            </Button>
            <Button
              variant="outline"
              className="border-indigo-500 text-indigo-700 hover:bg-indigo-50"
              onClick={() => {
                router.push("/auth/login");
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                router.push("/home");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section with Animated Elements */}
      <main className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-extrabold text-indigo-900 mb-6 leading-tight">
            Smart Attendance <br />
            Tracking Made Simple
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your attendance management with cutting-edge QR
            technology. Streamline check-ins, reduce manual work, and get
            instant insights.
          </p>
          <div className="flex space-x-4">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-indigo-500 text-indigo-700 hover:bg-indigo-50 shadow-md"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center relative"
        >
          <div className="bg-indigo-100 rounded-full p-8 animate-blob">
            <Smartphone
              className="h-80 w-80 text-gray-400 z-10 relative"
              strokeWidth={1}
            />
            <QrCode className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-40 w-40 text-indigo-600 z-20" />
          </div>
        </motion.div>
      </main>

      {/* Interactive Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-16 text-indigo-900">
            Features That Empower You
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFeature(index)}
                className={`
                  cursor-pointer p-6 rounded-xl transition-all duration-300
                  ${
                    activeFeature === index
                      ? "bg-indigo-600 text-white shadow-xl"
                      : `${feature.color} text-gray-800 hover:shadow-lg`
                  }
                `}
              >
                <feature.icon
                  className={`mx-auto h-12 w-12 mb-4 
                    ${
                      activeFeature === index ? "text-white" : "text-indigo-600"
                    }`}
                />
                <h4 className="text-xl font-semibold mb-3 text-center">
                  {feature.title}
                </h4>
                <p
                  className={`text-center 
                  ${
                    activeFeature === index ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 AttendSync. Revolutionizing Attendance Tracking.</p>
        </div>
      </footer>
    </div>
  );
};

export default AttendanceLandingPage;
