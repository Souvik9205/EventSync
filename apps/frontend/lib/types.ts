/* eslint-disable @typescript-eslint/no-unused-vars */

interface CustomField {
  id: string;
  eventId: string;
  fieldName: string;
  fieldType: string;
}

interface AttendeeFields {
  [key: string]: string | number;
}

interface Attendee {
  verified: unknown;
  id: string;
  user: string;
  eventId: string;
  timestamp: string;
  fields: AttendeeFields;
}

interface Review {
  id: string;
  eventId: string;
  participants: number;
  Review: number;
}

interface EventAttendees {
  attendees: Attendee[];
  createdById: string;
  customFields: CustomField[];
}

interface Event {
  id: string;
  name: string;
  additionalData: string;
  description: string;
  dateTime: string;
  createdAt: string;
  updatedAt: string;
  organization: string;
  createdById: string;
  location: string;
  orgImgURL: string;
  customFields: CustomField[];
  attendees: Attendee[];
  review: Review[];
  price: number;
  createdBy: {
    name: string;
  };
  tickets: number;
}

interface User {
  id: number;
  email: string;
  name: string | null;
  imgURL: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  message: string | null;
  event: Event | null;
}

interface QRCodeModalProps {
  showQRCode: boolean;
  setShowQRCode: (value: boolean) => void;
  shareUrl: string;
  title: string;
  orgURL: string;
}

interface Review {
  id: string;
  eventId: string;
  participants: number;
  Review: number;
}

interface ReviewCardProps {
  reviews: Review[];
  eventId: string;
  onReviewSubmit: (rating: number) => Promise<void>;
}

interface ReviewData {
  Review: number;
  participants: number;
}

interface EventReviewCardProps {
  review?: ReviewData[];
}

interface SidebarProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface EventFormData {
  name: string;
  description: string;
  organization: string;
  eventDate: string;
  eventTime: string;
  location: string;
  orgImgURL: string;
  tickets: string;
  customFields?: CustomField[];
  additionalData: string;
}

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: (event: Event) => void;
}
