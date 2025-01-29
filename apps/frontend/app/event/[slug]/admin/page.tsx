"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2, Users, User } from "lucide-react";
import { BACKEND_URL } from "@/app/secret";

// Types remain the same as your original code
interface User {
  id: string;
  name: string;
  email: string;
  imgURL: string | null;
  createdAt: string;
}

interface Event {
  name: string;
  organization: string;
  orgImgURL: string;
  createdBy: User;
  admins: User[];
}

interface EventResponse {
  event: Event;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const EventAdminPage = () => {
  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingUser, setAddingUser] = useState(false);
  const eventId = useParams().slug as string;

  const formik = useFormik({
    initialValues: {
      userId: "",
    },
    validationSchema: Yup.object({
      userId: Yup.string()
        .required("User ID is required")
        .min(3, "User ID must be at least 3 characters"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setAddingUser(true);
      try {
        const response = await fetch(`${BACKEND_URL}/event/ownership`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId,
            userId: values.userId,
          }),
        });

        if (response.ok) {
          toast.success("Admin added successfully!");
          resetForm();
          fetchEventData();
        } else {
          toast.error("Failed to add admin");
        }
      } catch (error) {
        toast.error("Error adding admin");
        console.error("Failed to add new owner:", error);
      } finally {
        setAddingUser(false);
      }
    },
  });

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/event/adminlist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });
      const data: EventResponse = await response.json();
      setEventData(data.event);
      toast.success("Event data loaded successfully");
    } catch (error) {
      toast.error("Failed to load event data");
      console.error("Failed to fetch event data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen"
        {...fadeInUp}
      >
        <p className="text-gray-500 text-lg">No event data found.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6 max-w-4xl space-y-8"
      initial="initial"
      animate="animate"
      variants={staggerChildren}
    >
      {/* Event Info Card */}
      <motion.div variants={fadeInUp}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-x-6 p-6">
            <div className="relative">
              <img
                src={eventData.orgImgURL || "/api/placeholder/128/128"}
                alt={eventData.organization}
                className="w-20 h-20 rounded-2xl object-cover shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {eventData.name}
              </CardTitle>
              <p className="text-base text-gray-500">
                {eventData.organization}
              </p>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Creator Info */}
      <motion.div variants={fadeInUp}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Event Creator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={
                    eventData.createdBy?.imgURL ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                      eventData.createdBy?.name
                  }
                  alt={eventData.createdBy?.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-transparent" />
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {eventData.createdBy?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {eventData.createdBy?.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add New Admin */}
      <motion.div variants={fadeInUp}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add New Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Enter user ID"
                  {...formik.getFieldProps("userId")}
                  className={`flex-1 ${formik.touched.userId && formik.errors.userId ? "border-red-500" : ""}`}
                />
                {formik.touched.userId && formik.errors.userId ? (
                  <motion.p
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {formik.errors.userId}
                  </motion.p>
                ) : null}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={addingUser || !formik.isValid}
              >
                {addingUser ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                Add Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Admins List */}
      <motion.div variants={fadeInUp}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Event Admins
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!eventData.admins || eventData.admins.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No admins found.</p>
            ) : (
              <motion.div className="space-y-4" variants={staggerChildren}>
                {eventData.admins.map((admin) => (
                  <motion.div
                    key={admin.id}
                    variants={fadeInUp}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-transparent hover:from-primary/5 transition-colors duration-300"
                  >
                    <div className="relative">
                      <img
                        src={
                          admin.imgURL ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                            admin.name
                        }
                        alt={admin.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-transparent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-lg">{admin.name}</p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Added: {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EventAdminPage;
