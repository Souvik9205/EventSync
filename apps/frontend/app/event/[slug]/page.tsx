"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Edit,
  QrCode,
  Share2,
  X,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BACKEND_URL, FRONTEND_URL } from "@/app/secret";
import { QRCodeCanvas } from "qrcode.react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";

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
  const [showQRCode, setShowQRCode] = useState(false);
  const [showScanAnimation, setShowScanAnimation] = useState(false);

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

  const shareUrl = `${FRONTEND_URL}/attendence/${eventId}`;
  const title = event?.name || "Check out this event!";

  const downloadQRCode = () => {
    const canvas = document.getElementById(
      "qr-code-canvas"
    ) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${event?.name}-qrcode.png`;
      link.href = url;
      link.click();
    }
  };

  const QRCodeModal = () => (
    <AnimatePresence>
      {showQRCode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowQRCode(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQRCode(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Scan to View Event
              </h3>

              <div className="relative inline-block">
                <QRCodeCanvas
                  id="qr-code-canvas"
                  value={shareUrl}
                  size={256}
                  level="H"
                  imageSettings={{
                    src: event?.orgImgURL as string,
                    height: 64,
                    width: 64,
                    excavate: true,
                  }}
                  className="rounded-lg shadow-lg"
                />

                <motion.div
                  initial={{ top: 0 }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute left-0 w-full h-2 bg-gradient-to-b from-indigo-500/50 to-transparent"
                />
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                <Button
                  onClick={downloadQRCode}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="mt-8">
                <p className="text-gray-600 mb-4">Share via</p>
                <div className="flex justify-center space-x-4">
                  <FacebookShareButton url={shareUrl} title={title}>
                    <FacebookIcon size={40} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} title={title}>
                    <TwitterIcon size={40} round />
                  </TwitterShareButton>
                  <LinkedinShareButton url={shareUrl} title={title}>
                    <LinkedinIcon size={40} round />
                  </LinkedinShareButton>
                  <WhatsappShareButton url={shareUrl} title={title}>
                    <WhatsappIcon size={40} round />
                  </WhatsappShareButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-indigo-600 text-2xl"
        >
          Loading event details...
        </motion.div>
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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
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
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-indigo-900 mb-4">
                {event.name}
              </h1>
              <p className="text-gray-600 mb-6">{event.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-indigo-500 text-indigo-700 hover:bg-indigo-50"
              >
                <Edit className="mr-2 h-5 w-5" /> Edit Event
              </Button>
              <Button
                variant="outline"
                className="border-indigo-500 text-indigo-700 hover:bg-indigo-50"
                onClick={() => setShowQRCode(true)}
              >
                <Share2 className="mr-2 h-5 w-5" /> Share
              </Button>
            </div>
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
              onClick={() => setShowQRCode(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Generate QR Code
              <QrCode className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        <QRCodeModal />
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
