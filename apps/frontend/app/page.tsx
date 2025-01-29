"use client";
import React from "react";
import {
  QrCode,
  Calendar,
  ChartBar,
  CheckCircle,
  ArrowRight,
  Ticket,
} from "lucide-react";
import { motion } from "framer-motion";
// import { Motion } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { useRouter } from "next/navigation";
import Feedback from "./_components/Feedback";
import LandingTab from "./_components/LandingTab";
import Navbar from "./_components/Navbar";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const primaryFeatures = [
  {
    icon: Calendar,
    title: "Easy Event Creation",
    description:
      "Create events in minutes with customizable registration forms",
  },
  {
    icon: Ticket,
    title: "QR Ticketing",
    description: "Automated ticket generation with secure QR codes",
  },
  {
    icon: CheckCircle,
    title: "Smart Attendance",
    description: "Real-time attendance tracking with instant verification",
  },
];

const EventLandingPage = () => {
  // const router = useRouter();

  return (
    <div>
      <Navbar />

      <div className=" min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
        <div>
          <div className="max-w-7xl mx-auto">
            <main className="container mx-auto px-4 md:py-16 py-6">
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="grid lg:grid-cols-2 gap-16 items-center"
              >
                <motion.div variants={fadeInUp}>
                  <span className="text-emerald-600 font-semibold text-sm md:text-lg mb-4 block">
                    All-in-One Event Management Platform
                  </span>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                    Create, Manage <br />&
                    <span className="text-emerald-600"> Track</span>
                    <br />
                    Events Effortlessly
                  </h1>
                  <p className="md:text-xl text-neutral-500 mb-8 leading-relaxed">
                    Transform your event management with our comprehensive
                    platform. From registration to analytics, everything you
                    need in one place.
                  </p>
                  <motion.div
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => (window.location.href = "/home")}
                      className="transition duration-300 hover:scale-105 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg group"
                    >
                      Let&apos;s Explore
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    {/* <Button
                      variant="outline"
                      size="lg"
                      onClick={() => (window.location.href = "/docs")}
                      className="transition duration-300 hover:scale-105 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                    >
                      Learn More
                    </Button> */}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="relative mx-3 md:mx-0"
                >
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 shadow-2xl">
                    <img
                      src="/api/placeholder/800/600"
                      alt="Platform Demo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.div
                    className="absolute -bottom-8 md:-left-8 -left-5 bg-white p-2 md:p-4 rounded-lg shadow-xl"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2">
                      <QrCode className="h-6 w-6 text-emerald-600" />
                      <span className="text-sm font-medium">
                        Instant Check-in
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -top-8 md:-right-8 -right-5 bg-white p-2 md:p-4 rounded-lg shadow-xl"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2">
                      <ChartBar className="h-6 w-6 text-teal-600" />
                      <span className="text-sm font-medium">
                        Live Analytics
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid md:grid-cols-3 gap-8 mt-24"
              >
                {primaryFeatures.map((feature, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all"
                  >
                    <feature.icon className="h-12 w-12 text-emerald-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                ))}
              </motion.div>

              <Feedback />
            </main>

            <LandingTab />
          </div>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="py-24 bg-gradient-to-r from-emerald-600 to-teal-200"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="container mx-auto px-4 text-center text-white"
            >
              <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
              <p className="text-xl mb-12 text-emerald-50 max-w-2xl mx-auto">
                Join thousands of event organizers who are creating
                extraordinary experiences
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => (window.location.href = "/home")}
                  className="bg-white text-emerald-600 hover:bg-emerald-50"
                >
                  Explore Yourself
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.section>

          <footer className="bg-gray-900 text-white py-6">
            <div className="container mx-auto px-4 text-center">
              <p>© 2024 EventSync. Elevating Event Management.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default EventLandingPage;
