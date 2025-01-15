import { Decimal } from "@prisma/client/runtime/library";
import { CreateEvent, GetEvent, GetReview } from "../types";
import { decodeToken } from "../utils/DecodeToken";
import prisma from "../utils/PrismaClient";

export const getEvent = async (
  token: string,
  eventId: string
): Promise<GetEvent> => {
  try {
    const id = decodeToken(token);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return {
        status: 404,
        data: {
          message: "User not found",
          event: null,
        },
      };
    }
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        name: true,
        description: true,
        organization: true,
        dateTime: true,
        location: true,
        orgImgURL: true,
        createdById: true,
        createdAt: true,
        customFields: true,
        attendees: true,
        tickets: true,
        review: true,
      },
    });
    if (!event) {
      return {
        status: 404,
        data: {
          message: "Event not found",
          event: null,
        },
      };
    }
    if (event.createdById !== id) {
      return {
        status: 403,
        data: {
          message: "You are not authorized to view this event",
          event: null,
        },
      };
    }
    return {
      status: 200,
      data: {
        message: null,
        event: {
          ...event,
          dateTime: event.dateTime.toISOString(),
          createdAt: event.createdAt.toISOString(),
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Internal server error",
        event: null,
      },
    };
  }
};

export const createEvent = async (
  token: string,
  data: CreateEvent
): Promise<{
  status: number;
  data: {
    message: string;
    event: any | null;
  };
}> => {
  try {
    const id = decodeToken(token);
    if (!id) {
      return {
        status: 401,
        data: {
          message: "Unauthorized",
          event: null,
        },
      };
    }
    const dateTime = new Date(`${data.eventDate}T${data.eventTime}`);
    if (isNaN(dateTime.getTime())) {
      return {
        status: 400,
        data: {
          message: "Invalid date or time format",
          event: null,
        },
      };
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return {
        status: 404,
        data: {
          message: "User not found",
          event: null,
        },
      };
    }

    const event = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        organization: data.organization,
        dateTime: dateTime,
        tickets: data.tickets,
        location: data.location,
        orgImgURL: data.orgImgURL,
        createdById: id,
        customFields: {
          create:
            data.customFields?.map(
              (field: { fieldName: string; fieldType: string }) => ({
                fieldName: field.fieldName,
                fieldType: field.fieldType,
              })
            ) || [],
        },
      },
      include: {
        customFields: true,
      },
    });

    return {
      status: 201,
      data: {
        message: "Event created successfully",
        event,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Internal server error",
        event: null,
      },
    };
  }
};

export const getUserEvent = async (eventId: string): Promise<GetEvent> => {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        name: true,
        description: true,
        organization: true,
        dateTime: true,
        location: true,
        orgImgURL: true,
        createdById: true,
        createdAt: true,
        customFields: true,
        tickets: true,
        review: true,
      },
    });
    if (!event) {
      return {
        status: 404,
        data: {
          message: "Event not found",
          event: null,
        },
      };
    }
    return {
      status: 200,
      data: {
        message: null,
        event: {
          ...event,
          dateTime: event.dateTime.toISOString(),
          createdAt: event.createdAt.toISOString(),
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Internal server error",
        event: null,
      },
    };
  }
};

export const reviewEvent = async (
  token: string,
  data: GetReview
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => {
  try {
    const id = decodeToken(token);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return {
        status: 404,
        data: {
          message: "User not found",
        },
      };
    }
    const event = await prisma.event.findUnique({
      where: {
        id: data.eventId,
      },
    });
    if (!event) {
      return {
        status: 404,
        data: {
          message: "Event not found",
        },
      };
    }

    const review = await prisma.review.findUnique({
      where: {
        eventId: data.eventId,
      },
    });
    if (!review) {
      await prisma.review.create({
        data: {
          eventId: data.eventId,
          Review: new Decimal(data.review),
          participants: 1,
        },
      });
    } else {
      const updatedReviewValue = new Decimal(review.Review)
        .mul(review.participants)
        .add(new Decimal(data.review))
        .div(review.participants + 1);

      await prisma.review.update({
        where: {
          eventId: data.eventId,
        },
        data: {
          participants: review.participants + 1,
          Review: updatedReviewValue,
        },
      });
    }
    return {
      status: 200,
      data: {
        message: "Event reviewed successfully",
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: `Internal server error, ${error}`,
      },
    };
  }
};
