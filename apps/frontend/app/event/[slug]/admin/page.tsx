"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Loader2,
  Users,
  Crown,
  ChevronDown,
  Mail,
  CalendarDays,
  QrCode,
} from "lucide-react";
import { BACKEND_URL } from "@/app/secret";

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
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [serverError, setServerError] = useState("");
  const eventId = useParams().slug as string;

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setAddingUser(true);
      setServerError("");
      try {
        const response = await fetch(`${BACKEND_URL}/event/ownership`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId,
            userEmail: values.email,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          resetForm();
          fetchEventData();
          setShowAddAdmin(false);
        } else {
          setServerError(data.message || "Failed to add admin");
        }
      } catch (error) {
        console.error("Error adding admin:", error);
        setServerError("An unexpected error occurred. Please try again.");
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
      const data = await response.json();
      setEventData(data.event);
    } catch (error) {
      console.error("Error fetching event data:", error);
      setServerError("Failed to load event data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex items-center justify-center">
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
      className="container mx-auto p-6 max-w-7xl space-y-8"
      initial="initial"
      animate="animate"
      variants={staggerChildren}
    >
      {/* Event Header */}
      <motion.div variants={fadeInUp}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-8 shadow-lg">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-8">
            <div className="shrink-0">
              <img
                src={eventData.orgImgURL || "/api/placeholder/128/128"}
                alt={eventData.organization}
                className="h-24 w-24 rounded-2xl object-cover shadow-lg ring-4 ring-white/80"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-emerald-950">
                {eventData.name}
              </h1>
              <p className="text-lg text-emerald-700">
                {eventData.organization}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Creator Card */}
        <motion.div variants={fadeInUp}>
          <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-100 via-emerald-50/70 to-white shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Crown className="h-5 w-5" />
                Event Creator
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-6">
                <img
                  src={
                    eventData.createdBy?.imgURL ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={eventData.createdBy?.name}
                  className="md:h-16 md:w-16 h-10 w-10 rounded-full object-cover ring-4 ring-emerald-100"
                />
                <div className="space-y-1">
                  <p className="text-xl font-semibold text-emerald-950">
                    {eventData.createdBy?.name}
                  </p>
                  <p className="flex items-center gap-2 text-emerald-700">
                    <Mail className="h-4 w-4" />
                    {eventData.createdBy?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Admin Section */}
        <motion.div variants={fadeInUp}>
          <Card className="border-none shadow-lg">
            <div
              className="flex cursor-pointer items-center justify-between bg-gradient-to-r from-emerald-50/80 via-emerald-50/50 to-transparent p-4"
              onClick={() => setShowAddAdmin(!showAddAdmin)}
            >
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <UserPlus className="h-5 w-5" />
                Add New Admin
              </CardTitle>
              <motion.div
                animate={{ rotate: showAddAdmin ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-emerald-600" />
              </motion.div>
            </div>
            <AnimatePresence>
              {showAddAdmin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="p-6">
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-emerald-400" />
                          <Input
                            placeholder="Enter admin's email"
                            {...formik.getFieldProps("email")}
                            className={`pl-10 ${
                              formik.touched.email &&
                              (formik.errors.email || serverError)
                                ? "border-red-500 focus:ring-red-500"
                                : "focus:ring-emerald-500"
                            }`}
                          />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                          <motion.p
                            className="text-sm text-red-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {formik.errors.email}
                          </motion.p>
                        )}
                        {serverError && (
                          <motion.p
                            className="text-sm text-red-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {serverError}
                          </motion.p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                        disabled={addingUser || !formik.isValid}
                      >
                        {addingUser ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <UserPlus className="mr-2 h-4 w-4" />
                        )}
                        Add Admin
                      </Button>
                    </form>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>

      {/* Admins List */}
      <motion.div variants={fadeInUp} className="">
        <Card className="border-none bg-gradient-to-br from-emerald-100 via-emerald-50/70 to-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Users className="h-5 w-5" />
              Event Admins ({eventData.admins.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!eventData.admins || eventData.admins.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-emerald-200" />
                <p className="mt-4 text-center text-emerald-600">
                  No additional admins yet.
                </p>
              </div>
            ) : (
              <motion.div
                className="grid gap-4 md:grid-cols-2"
                variants={staggerChildren}
              >
                {eventData.admins.map((admin) => (
                  <motion.div
                    key={admin.id}
                    variants={fadeInUp}
                    className="flex items-center gap-4 rounded-xl bg-white/70 p-4 shadow-sm transition-all hover:bg-white hover:shadow-md"
                  >
                    <img
                      src={
                        admin.imgURL ||
                        `https://cdn-icons-png.flaticon.com/512/149/149071.png`
                      }
                      alt={admin.name}
                      className="md:h-12 md:w-12 h-10 w-10 rounded-full object-cover ring-2 ring-emerald-100"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-medium text-emerald-950 truncate">
                        {admin.name}
                      </p>
                      <p className="text-sm text-emerald-700 truncate">
                        {admin.email}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-emerald-500">
                        <CalendarDays className="h-3 w-3" />
                        Added {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
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
