export interface LoginResponse {
  status: number;
  data: {
    message: string;
    token: string;
  };
}
export interface SignUpResponse {
  status: number;
  data: {
    message: string;
    user: {
      id: string;
      createdAt: string;
    };
    token: string;
  };
}

export interface GetUser {
  status: number;
  data: {
    message: string | null;
    user: {
      id: string;
      email: string;
      name: string | null;
      imgURL: string | null;
      createdAt: string;
      updatedAt: string;
    } | null;
  };
}

export interface UserEvent {
  status: number;
  data: {
    message: string | null;
    events: any | null;
  };
}

export interface GetEvent {
  status: number;
  data: {
    message: string | null;
    event: {
      name: string;
      description: string;
      organization: string;
      dateTime: string;
      location: string;
      orgImgURL: string;
      createdById: string;
      createdAt: string;
      customFields: CustomField[];
    } | null;
  };
}

export interface CustomField {
  id: string;
  eventId: string;
  fieldName: string;
  fieldType: string;
}

export interface CreateEvent {
  tickets: any;
  name: string;
  description: string;
  organization: string;
  eventDate: string;
  location: string;
  orgImgURL: string;
  eventTime: string;
  customFields?: CustomField[];
}
