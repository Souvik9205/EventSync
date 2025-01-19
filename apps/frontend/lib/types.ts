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
}
