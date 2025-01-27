"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "../secret";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Feedback = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-24"
    >
      <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Let's Connect</h2>
          <p className="text-emerald-50 mb-8">
            We're excited to hear from you! Share your thoughts, questions, or
            suggestions.
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
          </div>

          <div className="mt-12">
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4"></div>
          </div>
        </div>
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
  );
};

export default Feedback;
