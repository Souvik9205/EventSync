"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Edit,
  QrCode,
  Share2,
  Clock,
  Ticket,
  IndianRupee,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BACKEND_URL, FRONTEND_URL } from "@/app/secret";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { EventNotFound } from "@/app/_components/NotEvent";
import { EventLoadingState } from "@/app/_components/Loading";
import QRCodeModal from "@/app/_components/QrCodeModal";
import { RattingSimpleCard } from "@/app/_components/ReviewCard";
import EventUpdateModal from "@/app/_components/EditEventModal";
import { useAuthCheck } from "@/lib/authCheck";

function EventDetailPage() {
  const eventId = useParams().slug as string;
  const token = localStorage.getItem("token");
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [toggel, setToggel] = useState(false);

  useAuthCheck();
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
  }, [eventId, token, toggel]);

  const handleShareButton = () => {
    navigator.clipboard.writeText(shareEventUrl);
    toast.success("Link copied to clipboard");
  };

  const shareUrl = `${process.env.FRONTEND_URL || FRONTEND_URL}/attendence/${eventId}`;
  const shareEventUrl = `${process.env.FRONTEND_URL || FRONTEND_URL}/event/user/${eventId}`;
  const title = event?.name || "Check out this event!";

  if (loading) return <EventLoadingState />;
  if (!event) return <EventNotFound />;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };
  return (
    <>
      <div className="">
        <div className="relative min-h-[60vh] md:min-h-[45vh] lg:h-[60vh]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          </div>

          <div className="absolute top-10 md:top-20 right-10 md:right-20 w-32 md:w-64 h-32 md:h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 md:w-96 h-48 md:h-96 bg-emerald-500/10 rounded-full blur-3xl" />

          <motion.div
            className="relative container mx-auto px-4 md:px-6 h-auto py-8 md:py-16 flex flex-col md:flex-row items-center justify-start md:justify-between"
            {...fadeIn}
          >
            <div className="max-w-full md:max-w-2xl lg:max-w-4xl w-full">
              <div className="flex items-center space-x-4 md:space-x-6 mb-6 md:mb-8">
                <motion.img
                  src={event.orgImgURL}
                  alt={event.organization}
                  className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white p-2 md:p-3 shadow-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                />
                <motion.span
                  className="text-xl md:text-2xl text-white font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {event.organization}
                </motion.span>
              </div>

              <motion.h1
                className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {event.name}
              </motion.h1>
              <p className="text-white/80 text-sm md:text-base">
                created by{" "}
                <span className="text-white text-base md:text-lg">
                  {event.createdBy.name}
                </span>
              </p>

              <motion.div
                className="flex gap-4 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="secondary"
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="bg-white/80 hover:bg-white text-emerald-700 font-medium px-6 py-3 text-lg shadow-lg"
                >
                  <Edit className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5" /> Edit
                  Event
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white bg-transparent hover:bg-white hover:text-emerald-700 font-medium px-4 md:px-6 py-2 md:py-3 text-base md:text-lg"
                  onClick={handleShareButton}
                >
                  <Share2 className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5" />{" "}
                  Share Event
                </Button>
              </motion.div>
            </div>

            <div className="mt-6 md:mt-0 w-full md:w-auto">
              <RattingSimpleCard review={event.review} />
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 md:px-6 -mt-16 md:-mt-32 pb-10 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <motion.div
              className="lg:col-span-2 space-y-4 md:space-y-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-0">
                <CardContent className="p-4 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">
                    About the Event
                  </h2>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="space-y-4 md:space-y-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-0">
                <CardContent className="p-4 md:p-6">
                  <Button
                    size="lg"
                    onClick={() => setShowQRCode(true)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-base md:text-lg font-medium py-4 md:py-6 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Generate QR Code
                    <QrCode className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6" />
                  </Button>

                  <div className="mt-6 md:mt-8 space-y-4 md:space-y-6">
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
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
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
                        text: `${event.attendees.length} registered attendees`,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 md:space-x-4 text-gray-700 text-base md:text-lg"
                      >
                        <item.icon className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 flex-shrink-0" />
                        <span className="flex-1">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-0">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl font-semibold flex items-center text-gray-900">
                    <Info className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3 text-emerald-600" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    {event.additionalData}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <QRCodeModal
        setShowQRCode={setShowQRCode}
        showQRCode={showQRCode}
        shareUrl={shareUrl}
        title={title}
        orgURL={event.orgImgURL}
      />
      <EventUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onEventUpdated={() => {
          toast.success("Event updated successfully!");
          setToggel(!toggel);
        }}
        eventId={eventId}
      />
    </>
  );
}

export default EventDetailPage;
