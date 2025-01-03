"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  QrCode,
  ClipboardList,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { BACKEND_URL } from "@/app/secret";

interface CustomField {
  id: string;
  eventId: string;
  fieldName: string;
  fieldType: string;
}

interface Event {
  name: string;
  description: string;
  organization: string;
  dateTime: string;
  location: string;
  orgImgURL: string;
  createdById: string;
  createdAt: string;
  customFields: CustomField[];
}

interface ApiResponse {
  message: string | null;
  event: Event | null;
}

function EventFormPage() {
  const router = useRouter();
  const eventId = useParams().slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      sessionStorage.setItem("redirect", "/attendence/" + eventId);
      router.push("/auth/login");
    }
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/event/user/${eventId}`);
        const data: ApiResponse = await response.json();

        if (!data.event) {
          setError("Event does not exist");
          setLoading(false);
          return;
        }

        if (!data.event.customFields || data.event.customFields.length === 0) {
          setError("No form elements available for this event");
          setLoading(false);
          return;
        }

        setEvent(data.event);
        setLoading(false);
      } catch (error) {
        setError("Failed to load event details");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const generateValidationSchema = (fields: CustomField[]) => {
    const schemaFields: { [key: string]: any } = {};

    fields.forEach((field) => {
      switch (field.fieldType) {
        case "text":
          schemaFields[field.id] = Yup.string().required(
            `${field.fieldName} is required`
          );
          break;
        case "number":
          schemaFields[field.id] = Yup.number()
            .min(0, `${field.fieldName} must be positive`)
            .required(`${field.fieldName} is required`);
          break;
        case "date":
          schemaFields[field.id] = Yup.date().required(
            `${field.fieldName} is required`
          );
          break;
        default:
          schemaFields[field.id] = Yup.string().required(
            `${field.fieldName} is required`
          );
      }
    });

    return Yup.object().shape(schemaFields);
  };

  const generateInitialValues = (fields: CustomField[]) => {
    const values: { [key: string]: string } = {};
    fields.forEach((field) => {
      values[field.id] = "";
    });
    return values;
  };

  const handleSubmit = async (
    values: { [key: string]: string },
    { setSubmitting, setStatus }: any
  ) => {
    if (!token) {
      setStatus({
        message: "Please login to submit the form",
      });
      setSubmitting(false);
      return;
    }
    try {
      const formattedData = event?.customFields.reduce(
        (acc, field) => ({
          ...acc,
          [field.fieldName]: values[field.id],
        }),
        {}
      );
      const data = {
        eventId,
        data: formattedData,
      };
      console.log("data :", data);
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        setIsSubmitted(true);
      } else {
        setStatus({ message: "Failed to sumbit the form" });
      }
    } catch (e) {
      setStatus({ message: "An error occurred. Please try again later" });
    }
    setSubmitting(false);
  };

  const renderFormField = ({
    field,
    form: { touched, errors },
    ...props
  }: FieldProps) => {
    const customField = event?.customFields.find((f) => f.id === field.name);
    if (!customField) return null;

    const hasError = touched[field.name] && errors[field.name];

    return (
      <div className="space-y-1">
        <Input
          {...field}
          {...props}
          type={customField.fieldType}
          step={customField.fieldType === "number" ? "1" : undefined}
          className={`w-full ${hasError ? "border-red-500" : ""}`}
          placeholder={`Enter ${customField.fieldName.toLowerCase()}`}
        />
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {errors[field.name] as string}
          </motion.p>
        )}
      </div>
    );
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
          className="text-indigo-600 text-2xl"
        >
          <QrCode className="h-12 w-12" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white">
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

        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{error}</h2>
            <Button
              onClick={() => router.push("/home")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Return to Home
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.dateTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white">
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

      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-8">
              {/* Event Details Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={event.orgImgURL}
                    alt={`${event.organization} logo`}
                    className="h-16 w-16 rounded-full"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {event.name}
                    </h1>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm text-gray-600">
                      {eventDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm text-gray-600">
                      {eventDate.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm text-gray-600">
                      {event.location}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm text-gray-600">
                      {event.organization}
                    </span>
                  </div>
                </div>
              </motion.div>

              <AnimatePresence>
                {!isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                      <p className="text-sm text-indigo-700">
                        <ClipboardList className="inline-block mr-2 h-4 w-4" />
                        Please fill out the following information
                      </p>
                    </div>

                    <Formik
                      initialValues={generateInitialValues(event.customFields)}
                      validationSchema={generateValidationSchema(
                        event.customFields
                      )}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting, status }) => (
                        <Form className="space-y-6">
                          {status?.message && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              className="text-sm text-red-500"
                            >
                              {status.message}
                            </motion.div>
                          )}
                          {event.customFields.map((field, index) => (
                            <motion.div
                              key={field.id}
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="space-y-2"
                            >
                              <label
                                htmlFor={field.id}
                                className="block text-sm font-medium text-gray-700"
                              >
                                {field.fieldName}
                              </label>
                              <Field
                                name={field.id}
                                component={renderFormField}
                              />
                            </motion.div>
                          ))}

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-8"
                            >
                              {isSubmitting
                                ? "Submitting..."
                                : "Submit Registration"}
                            </Button>
                          </motion.div>
                        </Form>
                      )}
                    </Formik>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360],
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Registration Successful!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for registering for {event.name}
                    </p>
                    <Button
                      onClick={() => router.push("/home")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Return to Home
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <footer className="bg-indigo-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 AttendSync. Revolutionizing Attendance Tracking.</p>
        </div>
      </footer>
    </div>
  );
}
export default EventFormPage;
