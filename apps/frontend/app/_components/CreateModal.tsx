import React, { useState } from "react";
import {
  Building2,
  Calendar,
  Clock,
  Image,
  Link2,
  MapPin,
  Plus,
  Users,
  X,
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

interface CustomField {
  fieldName: string;
  fieldType: string;
}

export const EventCreationModal: React.FC<EventCreationModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
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
    customFields: [],
    additionalData: "",
  });

  const [error, setError] = useState<string | null>(null);

  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { fieldName: "", fieldType: "" }]);
  };

  const updateCustomField = (index: number, field: Partial<CustomField>) => {
    const updatedFields = [...customFields];
    updatedFields[index] = { ...updatedFields[index], ...field };
    setCustomFields(updatedFields);
  };

  const removeCustomField = (index: number) => {
    const updatedFields = customFields.filter((_, i) => i !== index);
    setCustomFields(updatedFields);
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

      const response = await fetch(`${BACKEND_URL}/event/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          customFields: customFields.map((field) => ({
            fieldName: field.fieldName,
            fieldType: field.fieldType,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create event");
      }

      onEventCreated?.(result.event);

      setFormData({
        name: "",
        description: "",
        organization: "",
        orgImgURL: "",
        eventDate: "",
        location: "",
        eventTime: "",
        tickets: "",
        customFields: [],
        additionalData: "",
      });
      setCustomFields([]);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-900">
            Create New Event
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill out the details for your new event. Fields marked with * are
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

          {/* Custom Fields Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-emerald-800">
                Registration Form Fields
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomField}
                className="hover:bg-emerald-50 border-emerald-500 text-emerald-600"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Field
              </Button>
            </div>

            <div className="space-y-3">
              {customFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white p-3 rounded-md shadow-sm"
                >
                  <Input
                    type="text"
                    placeholder="Field Name"
                    value={field.fieldName}
                    onChange={(e) =>
                      updateCustomField(index, { fieldName: e.target.value })
                    }
                    className="flex-grow transition-all duration-200 focus:ring-emerald-500"
                  />
                  <select
                    value={field.fieldType}
                    onChange={(e) =>
                      updateCustomField(index, { fieldType: e.target.value })
                    }
                    className="border rounded-md p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Type</option>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeCustomField(index)}
                    className="hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
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
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreationModal;
