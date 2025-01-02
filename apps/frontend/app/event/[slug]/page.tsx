"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowLeft, Edit, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/app/secret";

interface Event {
  id: string;
  name: string;
  description: string;
  dateTime: string;
  createdAt: string;
  updatedAt: string;
  organization: string;
  createdById: string;
  location: string;
  orgImgURL: string;
  expectedParticipants?: number;
}

function EventDetailPage() {
  const router = useRouter();
  const eventId = useParams().slug as string;
  const token = localStorage.getItem("token");
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEventDetails = async function (eventId: string) {
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/event/${eventId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await response.json();
          setEvent(result.event);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }
    };

    if (token && eventId) {
      getEventDetails(eventId);
    }
  }, [eventId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white flex items-center justify-center">
        <div className="animate-pulse text-indigo-600 text-2xl">
          Loading event details...
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">
            Event Not Found
          </h2>
          <Button
            onClick={() => router.push("/home")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <QrCode className="h-10 w-10 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-800">
              AttendSync
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-indigo-700 hover:bg-indigo-50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>
        </div>
      </header>

      {/* Event Details */}
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-indigo-900 mb-4">
                {event.name}
              </h1>
              <p className="text-gray-600 mb-6">{event.description}</p>
            </div>
            <Button
              variant="outline"
              className="border-indigo-500 text-indigo-700 hover:bg-indigo-50"
            >
              <Edit className="mr-2 h-5 w-5" /> Edit Event
            </Button>
          </div>

          <div className="flex items-center space-x-4 mb-8">
            <img
              src={event.orgImgURL}
              alt="organization logo"
              className="h-16 w-16 rounded-full"
            />
            <p className="text-gray-600">
              created by:{" "}
              <span className="font-bold text-indigo-900">
                {event.organization}
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-indigo-50 p-6 rounded-xl"
            >
              <Calendar className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">
                Event Date
              </h3>
              <p className="text-gray-700">
                {new Date(event.dateTime).toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-teal-50 p-6 rounded-xl"
            >
              <MapPin className="h-8 w-8 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold text-teal-900 mb-2">
                Location
              </h3>
              <p className="text-gray-700">
                {event.location || "Not specified"}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-purple-50 p-6 rounded-xl"
            >
              <Users className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-purple-900 mb-2">
                Participants
              </h3>
              <p className="text-gray-700">
                {event.expectedParticipants || "Not set"}
              </p>
            </motion.div>
          </div>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Generate QR Code
              <QrCode className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 AttendSync. Revolutionizing Attendance Tracking.</p>
        </div>
      </footer>
    </div>
  );
}

export default EventDetailPage;
