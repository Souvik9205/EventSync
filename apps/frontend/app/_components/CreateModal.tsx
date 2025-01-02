import React, { useState } from "react";
import { X } from "lucide-react";
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

interface EventFormData {
  name: string;
  description: string;
  organization: string;
  eventDate: string;
  eventTime: string;
  location: string;
  orgImgURL: string;
  customFields?: CustomField[];
}

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: (event: any) => void;
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
    customFields: [],
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
        customFields: [],
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill out the details for your new event
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
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
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="organization"
              className="block text-sm font-medium text-gray-700"
            >
              Organization *
            </label>
            <Input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="Organization Image"
              className="block text-sm font-medium text-gray-700"
            >
              Organization Image
            </label>
            <Input
              type="text"
              id="orgImgURL"
              name="orgImgURL"
              value={formData.orgImgURL}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="eventDate"
                className="block text-sm font-medium text-gray-700"
              >
                Event Date *
              </label>
              <Input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="eventTime"
                className="block text-sm font-medium text-gray-700"
              >
                Event Time *
              </label>
              <Input
                type="time"
                id="eventTime"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location *
            </label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Custom Fields
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomField}
              >
                Add Custom Field
              </Button>
            </div>

            {customFields.map((field, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  type="text"
                  placeholder="Field Name"
                  value={field.fieldName}
                  onChange={(e) =>
                    updateCustomField(index, { fieldName: e.target.value })
                  }
                  className="flex-grow"
                />
                <select
                  value={field.fieldType}
                  onChange={(e) =>
                    updateCustomField(index, { fieldType: e.target.value })
                  }
                  className="border rounded p-2"
                >
                  <option value="">Select Type</option>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeCustomField(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreationModal;
