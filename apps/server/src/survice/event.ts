import { Decimal } from "@prisma/client/runtime/library";
import {
  CreateEvent,
  GetEvent,
  GetEventAttendees,
  GetReview,
  UpdateEvent,
} from "../types";
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
        additionalData: true,
        dateTime: true,
        location: true,
        orgImgURL: true,
        createdById: true,
        createdAt: true,
        attendees: true,
        tickets: true,
        price: true,
        createdBy: true,
        review: true,
        admins: {
          select: {
            id: true,
          },
        },
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
    const isAdmin = event.admins.some((admin) => admin.id === id);
    if (event.createdById !== id && !isAdmin) {
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
        additionalData: data.additionalData,
        dateTime: dateTime,
        tickets: parseInt(data.tickets, 10),
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
        message: `Internal server error, ${error}`,
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
        additionalData: true,
        dateTime: true,
        location: true,
        orgImgURL: true,
        createdById: true,
        createdAt: true,
        tickets: true,
        review: true,
        price: true,
        createdBy: true,
        attendees: true,
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
          attendees: event.attendees?.length || 0,
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
export const getEventFields = async (eventId: string): Promise<any> => {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        organization: true,
        additionalData: true,
        dateTime: true,
        location: true,
        orgImgURL: true,
        customFields: true,
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

export const getEventAttendees = async (
  token: string,
  eventId: string
): Promise<GetEventAttendees> => {
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
        createdById: true,
        attendees: true,
        customFields: true,
        admins: {
          select: {
            id: true,
          },
        },
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
    const isAdmin = event.admins.some((admin) => admin.id === id);
    if (event.createdById !== id && !isAdmin) {
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

export const updateEvent = async (
  token: string,
  eventId: string,
  data: UpdateEvent
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

    const user = await prisma.user.findUnique({
      where: { id },
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

    const authEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        createdById: true,
        admins: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!authEvent) {
      return {
        status: 404,
        data: {
          message: "Event not found",
          event: null,
        },
      };
    }
    const isAdmin = authEvent.admins.some((admin) => admin.id === id);
    if (authEvent.createdById !== id && !isAdmin) {
      return {
        status: 403,
        data: {
          message: "You do not have permission to update this event",
          event: null,
        },
      };
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!existingEvent) {
      return {
        status: 404,
        data: {
          message: "Event not found",
          event: null,
        },
      };
    }

    const updatedDateTime =
      data.eventDate && data.eventTime
        ? new Date(`${data.eventDate}T${data.eventTime}`)
        : null;

    if (updatedDateTime && isNaN(updatedDateTime.getTime())) {
      return {
        status: 400,
        data: {
          message: "Invalid date or time format",
          event: null,
        },
      };
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name: data.name || existingEvent.name,
        description: data.description || existingEvent.description,
        organization: data.organization || existingEvent.organization,
        additionalData: data.additionalData || existingEvent.additionalData,
        dateTime: updatedDateTime || existingEvent.dateTime,
        tickets: data.tickets
          ? parseInt(data.tickets, 10)
          : existingEvent.tickets,
        location: data.location || existingEvent.location,
        orgImgURL: data.orgImgURL || existingEvent.orgImgURL,
      },
    });

    return {
      status: 200,
      data: {
        message: "Event updated successfully",
        event: updatedEvent,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: `Internal server error, ${error}`,
        event: null,
      },
    };
  }
};

export const giveOwnership = async (
  token: string,
  userId: string,
  eventId: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => {
  try {
    const id = decodeToken(token);

    if (!id) {
      return {
        status: 401,
        data: {
          message: "Unauthorized",
        },
      };
    }

    const requester = await prisma.user.findUnique({
      where: { id },
    });

    if (!requester) {
      return {
        status: 404,
        data: {
          message: "Requester not found",
        },
      };
    }
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        createdById: true,
        admins: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingEvent) {
      return {
        status: 404,
        data: {
          message: "Event not found",
        },
      };
    }

    const isAdmin = existingEvent.admins.some((admin) => admin.id === id);
    if (existingEvent.createdById !== id && !isAdmin) {
      return {
        status: 403,
        data: {
          message: "You do not have permission to give ownership",
        },
      };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return {
        status: 404,
        data: {
          message: "Target user not found",
        },
      };
    }

    const isAlreadyAdmin = existingEvent.admins.some(
      (admin) => admin.id === userId
    );

    if (!isAlreadyAdmin) {
      await prisma.event.update({
        where: { id: eventId },
        data: {
          admins: {
            connect: { id: userId },
          },
        },
      });
    }

    return {
      status: 200,
      data: {
        message: "Ownership granted successfully",
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

export const getOwnershipList = async (
  token: string,
  eventId: string
): Promise<any> => {
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
        id: eventId,
      },
      select: {
        name: true,
        organization: true,
        orgImgURL: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
            imgURL: true,
            createdAt: true,
          },
        },
        admins: {
          select: {
            id: true,
            email: true,
            name: true,
            imgURL: true,
            createdAt: true,
          },
        },
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
    const isAdmin = event.admins.some((admin) => admin.id === id);
    if (event.createdBy.id !== id && !isAdmin) {
      return {
        status: 403,
        data: {
          message: "You are not authorized to view admin data",
        },
      };
    }
    return {
      status: 200,
      data: {
        event,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Internal server error",
      },
    };
  }
};
