"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Edit,
  QrCode,
  Share2,
  X,
  BarChart,
  CalendarDays,
  Clock,
  UserCheck,
  Users2,
  Download,
  Ticket,
  IndianRupee,
  Info,
  Star,
  StarOff,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/app/_components/Navbar";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface CustomField {
  id: string;
  eventId: string;
  fieldName: string;
  fieldType: string;
}

interface AttendeeFields {
  [key: string]: string | number;
}

interface Attendee {
  id: string;
  user: string;
  eventId: string;
  timestamp: string;
  fields: AttendeeFields;
}

interface Review {
  id: string;
  eventId: string;
  participants: number;
  Review: number;
}

interface Event {
  id: string;
  name: string;
  additionalData: string;
  description: string;
  dateTime: string;
  createdAt: string;
  updatedAt: string;
  organization: string;
  createdById: string;
  location: string;
  orgImgURL: string;
  customFields: CustomField[];
  attendees: Attendee[];
  review: Review[];
  price: number;
  createdBy: {
    name: string;
  };
  tickets: number;
}

function EventDetailPage() {
  const router = useRouter();
  const eventId = useParams().slug as string;
  const token = localStorage.getItem("token");
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);

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

  const getAttendanceStats = () => {
    if (!event) return null;

    const totalRegistered = event.attendees.length;
    const today = new Date().toISOString().split("T")[0];
    const todayAttendees = event.attendees.filter(
      (a) => a.timestamp.split("T")[0] === today
    ).length;

    return {
      totalAttendees: totalRegistered,
      todayAttendees,
      uniqueDepartments: new Set(
        event.attendees.map((a) => a.fields["Department"]).filter(Boolean)
      ).size,
      averageAge:
        event.attendees.reduce((acc, curr) => {
          return acc + (Number(curr.fields["Age"]) || 0);
        }, 0) / totalRegistered || 0,
    };
  };

  const stats = getAttendanceStats();

  const shareUrl = `${FRONTEND_URL}/attendence/${eventId}`;
  const title = event?.name || "Check out this event!";

  const QRCodeModal = () => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
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
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <button
                onClick={() => setShowQRCode(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
              >
                <X className="h-6 w-6" />
              </button>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h3
                  className="text-2xl font-bold text-gray-900 mb-6"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Scan to View Event
                </motion.h3>

                <motion.div
                  className="relative inline-block bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
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
                    className="rounded-lg"
                  />

                  <motion.div
                    initial={{ top: 0, opacity: 0.5 }}
                    animate={{
                      top: ["0%", "100%", "0%"],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute left-0 w-full h-4 bg-gradient-to-b from-indigo-500/30 to-transparent"
                  />
                </motion.div>

                <motion.div
                  className="mt-6 p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-sm text-gray-600 mb-2">Event Link</p>
                  <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 text-sm text-gray-700 outline-none"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="ghost"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      {copied ? (
                        <motion.span
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="text-green-600"
                        >
                          Copied!
                        </motion.span>
                      ) : (
                        "Copy"
                      )}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-gray-600 mb-4">Share via</p>
                  <div className="flex justify-center gap-4">
                    {[
                      {
                        Button: FacebookShareButton,
                        Icon: FacebookIcon,
                        color: "bg-blue-100",
                      },
                      {
                        Button: TwitterShareButton,
                        Icon: TwitterIcon,
                        color: "bg-sky-100",
                      },
                      {
                        Button: LinkedinShareButton,
                        Icon: LinkedinIcon,
                        color: "bg-blue-100",
                      },
                      {
                        Button: WhatsappShareButton,
                        Icon: WhatsappIcon,
                        color: "bg-green-100",
                      },
                    ].map((Platform, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Platform.Button url={shareUrl} title={title}>
                          <div
                            className={`p-2 rounded-full ${Platform.color} hover:brightness-95`}
                          >
                            <Platform.Icon size={32} round />
                          </div>
                        </Platform.Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

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
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Navbar />

      {/* Hero Section with Glassmorphism */}
      <div className="relative h-[55vh] overflow-hidden">
        {/* Background gradient with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        {/* Main Content */}
        <motion.div
          className="relative container mx-auto px-6 h-auto py-16 flex items-center"
          {...fadeIn}
        >
          <div className="max-w-4xl">
            <div className="flex items-center space-x-6 mb-8">
              <motion.img
                src={event.orgImgURL}
                alt={event.organization}
                className="h-20 w-20 rounded-2xl bg-white p-3 shadow-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              />
              <motion.span
                className="text-2xl text-white font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {event.organization}
              </motion.span>
            </div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {event.name}
            </motion.h1>
            <p className="text-white/80">
              created by{" "}
              <span className="text-white text-lg">{event.createdBy.name}</span>
            </p>

            <motion.div
              className="flex gap-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="secondary"
                className="bg-white/80 hover:bg-white text-emerald-700 font-medium px-6 py-3 text-lg shadow-lg"
              >
                <Edit className="mr-3 h-5 w-5" /> Edit Event
              </Button>
              <Button
                variant="outline"
                className="border-white text-white bg-transparent hover:bg-white hover:text-emerald-700 font-medium px-6 py-3 text-lg"
                onClick={() => setShowQRCode(true)}
              >
                <Share2 className="mr-3 h-5 w-5" /> Share Event
              </Button>
            </motion.div>
          </div>

          {event?.review && event.review.length > 0 ? (
            <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-0 overflow-hidden absolute top-20 right-20">
              <CardContent className="p-6">
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Rating Number */}
                  <motion.div
                    className="shrink-0"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {event.review[0].Review}
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <div className="h-12 w-px bg-gradient-to-b from-emerald-100 to-teal-100" />

                  {/* Stars and Participants */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              index < Math.round(event.review[0].Review)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      className="text-sm text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {event.review[0].participants} rating
                      {event.review[0].participants > 1 ? "s" : ""}
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          ) : (
            <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-0 overflow-hidden absolute top-20 right-20">
              <CardContent className="p-6">
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <StarOff className="h-5 w-5 text-gray-300" />
                  <span className="text-sm text-gray-500">No ratings yet</span>
                </motion.div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 -mt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                  About the Event
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-0">
              <CardContent className="p-6">
                <Button
                  size="lg"
                  onClick={() => setShowQRCode(true)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg font-medium py-6 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Generate QR Code
                  <QrCode className="ml-3 h-6 w-6" />
                </Button>

                <div className="mt-8 space-y-6">
                  {[
                    {
                      icon: Calendar,
                      text: new Date(event.dateTime).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      ),
                    },
                    {
                      icon: Clock,
                      text: new Date(event.dateTime).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit" }
                      ),
                    },
                    { icon: MapPin, text: event.location },
                    {
                      icon: Ticket,
                      text: `${event.tickets ? `${event.tickets} total seats available` : "no set seat limit"}`,
                    },
                    {
                      icon: IndianRupee,
                      text: event.price === 0 ? "Free" : `₹${event.price}`,
                    },
                    {
                      icon: Users,
                      text: `${event.attendees?.length || 0} registered attendees`,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 text-gray-700 text-lg"
                    >
                      <item.icon className="h-6 w-6 text-emerald-600" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center text-gray-900">
                  <Info className="h-6 w-6 mr-3 text-emerald-600" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {event.additionalData}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <QRCodeModal />
    </div>
  );
}

export default EventDetailPage;
