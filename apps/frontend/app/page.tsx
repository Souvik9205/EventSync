"use client";
import React, { useState } from "react";
import {
  QrCode,
  Calendar,
  ChartBar,
  FileSpreadsheet,
  Presentation,
  Calculator,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Clock,
  DollarSign,
  Ticket,
  Mail,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "./_components/Navbar";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "./secret";

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
  const [activeTab, setActiveTab] = useState("events Management");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFeedbackSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const templateParams = {
        user_name: name,
        user_email: email,
        user_message: message,
        to_email: "souvik9205@gmail.com",
        subject: "EventSync connect",
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      toast.success("Thank you for your feedback!", {
        description: "We will get back to you soon.",
      });

      setEmail("");
      setMessage("");
      setName("");
    } catch (error) {
      toast.error("Failed to send feedback", {
        description: "Please try again later or contact us directly.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
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
                Transform your event management with our comprehensive platform.
                From registration to analytics, everything you need in one
                place.
              </p>
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  size="lg"
                  onClick={() => router.push("/home")}
                  className="transition duration-300 hover:scale-105 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg group"
                >
                  Let's Explore
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/docs")}
                  className="transition duration-300 hover:scale-105 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                >
                  Learn More
                </Button>
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
                  <span className="text-sm font-medium">Instant Check-in</span>
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
                  <span className="text-sm font-medium">Live Analytics</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Features Section */}
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
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-24"
          >
            <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-xl">
              {/* Left side - Contact Information */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-8 md:p-12 text-white">
                <h2 className="text-3xl font-bold mb-6">Let's Connect</h2>
                <p className="text-emerald-50 mb-8">
                  We're excited to hear from you! Share your thoughts,
                  questions, or suggestions.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-emerald-500/20 p-3 rounded-full">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email Us</h3>
                      <p className="text-sm text-emerald-50">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  {/* Add more contact info sections if needed */}
                </div>

                <div className="mt-12">
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {/* Add social media icons/links here */}
                  </div>
                </div>
              </div>

              {/* Right side - Feedback Form */}
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>

                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-gray-50 border-gray-200 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-gray-50 border-gray-200 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full min-h-[150px] bg-gray-50 border-gray-200 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Features Tab Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center flex-wrap gap-4 mb-16"
            >
              {[
                "events Management",
                "Tools & Analytics",
                "Financial Management",
              ].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? "bg-emerald-600 text-white"
                      : "border-emerald-200 text-gray-600"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </motion.div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {activeTab === "events Management" &&
                [
                  {
                    icon: Calendar,
                    title: "Registration System",
                    description:
                      "Custom forms with email verification and automated responses",
                  },
                  {
                    icon: QrCode,
                    title: "Digital Tickets",
                    description:
                      "QR-coded tickets sent directly to attendees' emails",
                  },
                  {
                    icon: Clock,
                    title: "Real-time Updates",
                    description:
                      "Instant notifications and event status tracking",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className={`p-6 hover:shadow-xl transition-all cursor-pointer
                      ${index % 2 === 0 ? "bg-gradient-to-tr from-white to-emerald-700/20" : "bg-gradient-to-tr from-white to-sky-700/20"}
                    `}
                  >
                    <feature.icon
                      className={`h-12 w-12 mb-4 text-emerald-600`}
                    />
                    <h3 className={`text-xl font-semibold mb-3`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}

              {activeTab === "Tools & Analytics" &&
                [
                  {
                    icon: Presentation,
                    title: "Presentation Suite",
                    description:
                      "Enhanced environment for PPT uploads and live presentations",
                  },
                  {
                    icon: BarChart3,
                    title: "Advanced Analytics",
                    description:
                      "Comprehensive attendance stats and engagement metrics",
                  },
                  {
                    icon: FileSpreadsheet,
                    title: "Export Tools",
                    description:
                      "One-click export to Excel and detailed report generation",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className={`p-6 hover:shadow-xl transition-all cursor-pointer
                      ${index % 2 === 0 ? "bg-gradient-to-tr from-white to-emerald-700/20" : "bg-gradient-to-tr from-white to-sky-700/20"}
                    `}
                  >
                    <feature.icon
                      className={`h-12 w-12 mb-4 text-emerald-600`}
                    />
                    <h3 className={`text-xl font-semibold mb-3`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}

              {activeTab === "Financial Management" &&
                [
                  {
                    icon: Calculator,
                    title: "Budget Planning",
                    description:
                      "Interactive budget calculator and expense tracking",
                  },
                  {
                    icon: DollarSign,
                    title: "Payment Processing",
                    description:
                      "Secure payment gateway for ticket sales (Coming Soon)",
                  },
                  {
                    icon: ChartBar,
                    title: "Financial Reports",
                    description: "Detailed financial analytics and projections",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className={`p-6 hover:shadow-xl transition-all cursor-pointer
                      ${index % 2 === 0 ? "bg-gradient-to-tr from-white to-emerald-700/20" : "bg-gradient-to-tr from-white to-sky-700/20"}
                    `}
                  >
                    <feature.icon
                      className={`h-12 w-12 mb-4 text-emerald-600`}
                    />
                    <h3 className={`text-xl font-semibold mb-3`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </section>
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
            Join thousands of event organizers who are creating extraordinary
            experiences
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={() => router.push("/home")}
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
  );
};

export default EventLandingPage;
