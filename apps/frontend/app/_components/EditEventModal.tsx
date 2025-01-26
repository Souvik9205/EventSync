import React, { useState, useEffect } from "react";
import {
  Building2,
  Calendar,
  Clock,
  Image,
  Link2,
  MapPin,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from "../secret";

interface EventUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: () => void;
  eventId: string;
}

interface EventFormData {
  name: string;
  description: string;
  organization: string;
  orgImgURL: string;
  location: string;
  eventDate: string;
  eventTime: string;
  tickets: string;
  additionalData: string;
}

export const EventUpdateModal: React.FC<EventUpdateModalProps> = ({
  isOpen,
  onClose,
  onEventUpdated,
  eventId,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    organization: "",
    orgImgURL: "",
    location: "",
    eventDate: "",
    eventTime: "",
    tickets: "",
    additionalData: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId || !isOpen) return;

      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await response.json();
        const eventData = data.event;

        const dateTime = new Date(eventData.dateTime);
        const formattedDate = dateTime.toISOString().split("T")[0];
        const formattedTime = dateTime.toTimeString().slice(0, 5);

        setFormData({
          name: eventData.name || "",
          description: eventData.description || "",
          organization: eventData.organization || "",
          orgImgURL: eventData.orgImgURL || "",
          location: eventData.location || "",
          eventDate: formattedDate,
          eventTime: formattedTime,
          tickets: eventData.tickets?.toString() || "",
          additionalData: eventData.additionalData || "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load event data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.name ||
      !formData.organization ||
      !formData.eventDate ||
      !formData.eventTime ||
      !formData.location
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/event/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          eventId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event");
      }

      onEventUpdated();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-900">
            Update Event
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update the details for your event. Fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4">
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Name *
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-emerald-500"
                  placeholder="Enter event name"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[100px] transition-all duration-200 focus:ring-emerald-500"
                  placeholder="Describe your event"
                />
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4">
              Organization Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="organization"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <Building2 className="w-4 h-4 mr-2 text-emerald-600" />
                  Organization *
                </label>
                <Input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-emerald-500"
                  placeholder="Organization name"
                />
              </div>

              <div>
                <label
                  htmlFor="orgImgURL"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <Image className="w-4 h-4 mr-2 text-emerald-600" />
                  Organization Image URL
                </label>
                <Input
                  type="text"
                  id="orgImgURL"
                  name="orgImgURL"
                  value={formData.orgImgURL}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:ring-emerald-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Date, Time, and Location */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4">
              Event Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eventDate"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                  Event Date *
                </label>
                <Input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label
                  htmlFor="eventTime"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <Clock className="w-4 h-4 mr-2 text-emerald-600" />
                  Event Time *
                </label>
                <Input
                  type="time"
                  id="eventTime"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                  Location *
                </label>
                <Input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-emerald-500"
                  placeholder="Event location"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4">
              Additional Information
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="tickets"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <Users className="w-4 h-4 mr-2 text-emerald-600" />
                  Total Tickets
                </label>
                <Input
                  type="number"
                  id="tickets"
                  name="tickets"
                  value={formData.tickets}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:ring-emerald-500"
                  placeholder="Number of tickets available"
                />
              </div>

              <div>
                <label
                  htmlFor="additionalData"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <Link2 className="w-4 h-4 mr-2 text-emerald-600" />
                  Additional Details/URL
                </label>
                <Textarea
                  id="additionalData"
                  name="additionalData"
                  value={formData.additionalData}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:ring-emerald-500"
                  placeholder="Any additional information or relevant links"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Update Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventUpdateModal;
