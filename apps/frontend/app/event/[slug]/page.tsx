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
  BarChart,
  CalendarDays,
  Clock,
  UserCheck,
  Users2,
  Percent,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  customFields: CustomField[];
  attendees: Attendee[];
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
      <div className="container mx-auto px-4 pt-16">
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
                {event.attendees.length || "Not set"}
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
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Attendees
              </CardTitle>
              <UserCheck className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900">
                {stats?.totalAttendees || 0}
              </div>
              <p className="text-xs text-gray-500">people registered</p>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Today's Attendance
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">
                {stats?.todayAttendees || 0}
              </div>
              <p className="text-xs text-gray-500">checked in today</p>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Departments
              </CardTitle>
              <Users2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {stats?.uniqueDepartments || 0}
              </div>
              <p className="text-xs text-gray-500">unique departments</p>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Average Age
              </CardTitle>
              <BarChart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {stats?.averageAge.toFixed(1)}
              </div>
              <p className="text-xs text-gray-500">years</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Records Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-900">
              Attendance Records
            </h2>
            <Button
              variant="outline"
              className="border-indigo-500 text-indigo-700 hover:bg-indigo-50"
            >
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-indigo-50/60">
                    <TableHead className="py-4 px-6 text-left text-sm font-semibold text-indigo-900">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Timestamp</span>
                      </div>
                    </TableHead>
                    {event?.customFields?.map((field) => (
                      <TableHead
                        key={field.id}
                        className="py-4 px-6 text-left text-sm font-semibold text-indigo-900"
                      >
                        {field.fieldName}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {event?.attendees?.map((attendee) => (
                    <TableRow
                      key={attendee.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="py-4 px-6 text-sm font-medium text-gray-900">
                        {new Date(attendee.timestamp).toLocaleString()}
                      </TableCell>
                      {event?.customFields?.map((field) => (
                        <TableCell
                          key={field.id}
                          className="py-4 px-6 text-sm text-gray-500"
                        >
                          {attendee.fields[field.fieldName]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {event?.attendees.length === 0 && (
            <div className="text-center py-12">
              <Users2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No attendees yet
              </h3>
              <p className="text-gray-500">
                Share the QR code to start collecting attendance.
              </p>
            </div>
          )}
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
