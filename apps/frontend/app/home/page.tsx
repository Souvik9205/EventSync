"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import EventCreationModal from "../_components/CreateModal";
import { toast } from "sonner";
import { Users, Calendar, PlusCircle, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import EditProfileModal from "../_components/UpdateUserModal";
import { BACKEND_URL } from "../secret";
import Navbar from "../_components/Navbar";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};

const UserProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
    }
  }, []);

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
    if (localStorage.getItem("token") != "") {
      fetchUserData();
      fetchUserEventData();
    }
  }, [isModalOpen, isEditModalOpen]);

  const handleCreateEvent = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white flex items-center justify-center">
        <div className="animate-pulse text-indigo-600 text-2xl">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-8">
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
                <h1 className="text-3xl font-bold text-indigo-900">
                  {user?.name || "User Profile"}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-indigo-500 text-indigo-700 hover:bg-indigo-50"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="mr-2 h-5 w-5" /> Edit Profile
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-indigo-50 p-6 rounded-xl"
            >
              <Calendar className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">
                Joined
              </h3>
              <p className="text-gray-700">
                {new Date(user?.createdAt || "").toLocaleDateString()}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-teal-50 p-6 rounded-xl"
            >
              <Users className="h-8 w-8 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold text-teal-900 mb-2">
                Total Events
              </h3>
              <p className="text-gray-700">{events.length}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-purple-50 p-6 rounded-xl"
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
            <h2 className="text-3xl font-bold text-indigo-900">My Events</h2>
            <Button
              onClick={handleCreateEvent}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Create Event
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Create First Event
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow
                    key={event.id}
                    className="cursor-pointer hover:bg-indigo-50 transition-colors"
                    onClick={() => router.push(`/event/${event.id}`)}
                  >
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>{formatDate(event.dateTime)}</TableCell>
                    <TableCell>{event.organization}</TableCell>
                    <TableCell>{formatDate(event.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 AttendSync. Revolutionizing Attendance Tracking.</p>
        </div>
      </footer>

      <EventCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={() => {
          toast.success("Event created successfully!");
          // Optionally, you could refresh the events here
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
  );
};

export default UserProfilePage;
