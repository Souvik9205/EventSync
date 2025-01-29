"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  FileSpreadsheet,
  Presentation,
  QrCode,
  Send,
  UserCog2Icon,
} from "lucide-react";

const LandingTab = () => {
  const [activeTab, setActiveTab] = useState("events Management");
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center flex-wrap gap-4 mb-16"
        >
          {["events Management", "Tools & Analytics", "Event Management"].map(
            (tab) => (
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
            )
          )}
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
                description: "Instant notifications and event status tracking",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`p-6 hover:shadow-xl transition-all cursor-pointer
              ${index % 2 === 0 ? "bg-gradient-to-tr from-white to-emerald-700/20" : "bg-gradient-to-tr from-white to-sky-700/20"}
            `}
              >
                <feature.icon className={`h-12 w-12 mb-4 text-emerald-600`} />
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
                  "Enhanced environment for PPT uploads and live presentations (Coming Soon)",
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
                <feature.icon className={`h-12 w-12 mb-4 text-emerald-600`} />
                <h3 className={`text-xl font-semibold mb-3`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}

          {activeTab === "Event Management" &&
            [
              {
                icon: Send,
                title: "Custom Email",
                description:
                  "Oneclick custom email templates to send all attendees (Coming Soon)",
              },
              {
                icon: DollarSign,
                title: "Payment Processing",
                description:
                  "Secure payment gateway for ticket sales (Coming Soon)",
              },
              {
                icon: UserCog2Icon,
                title: "Multiple Admins",
                description: "Add Admins to manage events and attendees",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`p-6 hover:shadow-xl transition-all cursor-pointer
              ${index % 2 === 0 ? "bg-gradient-to-tr from-white to-emerald-700/20" : "bg-gradient-to-tr from-white to-sky-700/20"}
            `}
              >
                <feature.icon className={`h-12 w-12 mb-4 text-emerald-600`} />
                <h3 className={`text-xl font-semibold mb-3`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LandingTab;
