"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import EventCreationModal from "../_components/CreateModal";
import { toast } from "sonner";
import {
  Users,
  Calendar,
  PlusCircle,
  Edit,
  QrCode,
  LogOut,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditProfileModal from "../_components/UpdateUserModal";
import { BACKEND_URL } from "../secret";
import Navbar from "../_components/Navbar";
import { useAuthCheck } from "@/lib/authCheck";

const formatDate = (
  dateString: string,
  variant: "date-only" | "full" = "full"
) => {
  const options: Intl.DateTimeFormatOptions =
    variant === "date-only"
      ? { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }
      : {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        };

  return new Date(dateString).toLocaleString("en-US", options);
};

const UserProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  useAuthCheck();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`${BACKEND_URL}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };
    const fetchUserEventData = async () => {
      try {
        const userEventResponse = await fetch(`${BACKEND_URL}/user/events`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!userEventResponse.ok) {
          throw new Error("Failed to fetch user details");
        }
        const userEventData = await userEventResponse.json();
        setEvents(userEventData.events);

        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    const fetchRegistedEventData = async () => {
      setLoading(true);
      try {
        const registeredEventResponse = await fetch(
          `${BACKEND_URL}/user/registered/events`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!registeredEventResponse.ok) {
          toast.error("Failed to fetch user details");
        }
        const registeredEventData = await registeredEventResponse.json();
        setRegisteredEvents(registeredEventData.events);

        setLoading(false);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    if (localStorage.getItem("token") != "") {
      fetchUserData();
      fetchUserEventData();
      fetchRegistedEventData();
    }
  }, [isModalOpen, isEditModalOpen]);

  const handleCreateEvent = () => {
    setIsModalOpen(true);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-emerald-600 text-2xl"
        >
          <QrCode className="h-12 w-12" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-white flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-white">
        <main className="container mx-auto px-4 py-4 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center space-x-4">
                {user?.imgURL ? (
                  <img
                    src={user?.imgURL}
                    className="rounded-full h-12 w-12"
                    alt="User"
                  />
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    className="rounded-full h-12 w-12"
                    alt="User"
                  />
                )}

                <div>
                  <h1 className="text-3xl font-bold text-emerald-900">
                    {user?.name}
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Button
                  variant="outline"
                  className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="mr-2 h-5 w-5" /> Edit Profile
                </Button>
                <LogOut
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/");
                  }}
                  className="text-emerald-600 cursor-pointer hover:text-red-700 hover:scale-110 transition duration-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-emerald-50 p-4 md:p-6 rounded-xl"
              >
                <Calendar className="h-8 w-8 text-emerald-600 mb-4" />
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                  Joined
                </h3>
                <p className="text-gray-700">
                  {new Date(user?.createdAt || "").toLocaleDateString()}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-teal-50 p-4 md:p-6 rounded-xl"
              >
                <Users className="h-8 w-8 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold text-teal-900 mb-2">
                  Total Events
                </h3>
                <p className="text-gray-700">{events.length}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-purple-50 p-4 md:p-6 rounded-xl"
              >
                <Calendar className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  Last Updated
                </h3>
                <p className="text-gray-700">
                  {new Date(user?.updatedAt || "").toLocaleDateString()}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Events Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-emerald-900">My Events</h2>
              <Button
                onClick={handleCreateEvent}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <PlusCircle className="md:mr-2 h-5 w-5" />
                <span className="hidden md:inline">Create Event</span>
              </Button>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-500 mb-4">
                  No events created yet
                </p>
                <p className="text-gray-400 mb-6">
                  Start by creating your first event!
                </p>
                <Button
                  onClick={handleCreateEvent}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Create First Event
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Description
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Date & Time
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created At
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow
                      key={event.id}
                      className="cursor-pointer hover:bg-emerald-50 transition-colors"
                      onClick={() => router.push(`/event/${event.id}`)}
                    >
                      <TableCell>{event.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {truncateText(event.description, 150)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(event.dateTime)}
                      </TableCell>
                      <TableCell>
                        {formatDate(event.dateTime, "date-only")}
                      </TableCell>
                      <TableCell>{event.organization}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(event.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8 mt-4"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-emerald-900">
                  Registered Events
                </h2>
                <p className="text-gray-600">Events you're participating in</p>
              </div>
            </div>

            {registeredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-500 mb-4">
                  No events registered yet
                </p>

                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Calendar className="mr-2 h-5 w-5" /> No Events
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/event/user/${event.id}`)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 text-sm bg-emerald-100 text-emerald-800 rounded-full">
                          {event.organization}
                        </span>
                        <time className="text-sm text-gray-500">
                          {formatDate(event.dateTime, "date-only")}
                        </time>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {event.name}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(event.dateTime).split("at")[1]}
                        </div>
                        <Button
                          variant="ghost"
                          className="text-emerald-600 hover:text-emerald-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/event/user/${event.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>

        <EventCreationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={() => {
            toast.success("Event created successfully!");
          }}
        />

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          prevName={user?.name || ""}
          prevImgURL={user?.imgURL || ""}
          onProfileUpdated={() => {
            toast.success("Profile updated successfully!");
          }}
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
