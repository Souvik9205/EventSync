import { decodeToken } from "../utils/DecodeToken";
import prisma from "../utils/PrismaClient";

export const registerService = async (
  userId: string,
  eventId: string,
  data: any
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => {
  try {
    const id = decodeToken(userId);
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
        attendees: true,
        tickets: true,
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
    const alreadyRegistered = await prisma.attendance.findFirst({
      where: {
        user: id,
        eventId,
      },
    });
    if (alreadyRegistered) {
      return {
        status: 409,
        data: {
          message: "User already registered for this event",
        },
      };
    }
    if (event.tickets) {
      if (event.attendees.length >= event.tickets) {
        return {
          status: 409,
          data: {
            message: "Event registration is full",
          },
        };
      }
    }

    const register = await prisma.attendance.create({
      data: {
        user: id,
        eventId,
        fields: data,
      },
    });
    if (!register) {
      return {
        status: 500,
        data: {
          message: "Error registering attendance",
        },
      };
    }
    return {
      status: 200,
      data: {
        message: "Attendance registered successfully",
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Error registering attendance",
      },
    };
  }
};

export const getAttendence = async (
  userId: string,
  eventId: string
): Promise<{
  status: number;
  data: {
    message: string;
    event: any | null;
  };
}> => {
  try {
    const id = decodeToken(userId);
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
        message: "Event attendees fetched successfully",
        event: event,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Error fetching event attendees",
        event: null,
      },
    };
  }
};
