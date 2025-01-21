import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BACKEND_URL } from "../secret";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
  prevName: string;
  prevImgURL: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
  prevName,
  prevImgURL,
}) => {
  const [name, setName] = useState(prevName);
  const [imgURL, setImgURL] = useState(prevImgURL);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/user/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, imgURL }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      toast.success("Profile updated successfully!");
      onProfileUpdated();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            {imgURL && (
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg mb-4">
                <img
                  src={imgURL}
                  alt="Profile Preview"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <Input
              placeholder="Image URL"
              value={imgURL}
              onChange={(e) => setImgURL(e.target.value)}
              disabled={loading}
            />
          </div>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            className="hover:text-white hover:bg-emerald-500 bg-emerald-700 text-white font-medium px-4 md:px-6 py-2 md:py-3 text-base md:text-lg"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="border-emerald-700 text-emerald-700 bg-transparent hover:bg-emerald-700 hover:text-white font-medium px-4 md:px-6 py-2 md:py-3 text-base md:text-lg"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
