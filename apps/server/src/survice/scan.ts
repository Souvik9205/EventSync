import { decodeToken } from "../utils/DecodeToken";
import prisma from "../utils/PrismaClient";

export const scanEvent = async (
  attendanceId: string,
  eventId: string
): Promise<{
  status: number;
  data: any;
}> => {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
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
    const attendance = await prisma.attendance.findUnique({
      where: {
        id: attendanceId,
        eventId: eventId,
      },
      select: {
        user: true,
        verified: true,
      },
    });
    if (!attendance) {
      return {
        status: 404,
        data: {
          message: "Attendance not found",
        },
      };
    }
    if (attendance.verified == true) {
      return {
        status: 400,
        data: {
          message: "Attendee already verified",
        },
      };
    }
    const user = await prisma.user.findUnique({
      where: {
        id: attendance.user,
      },
      select: {
        name: true,
        email: true,
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
    return {
      status: 200,
      data: {
        user: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Server error",
      },
    };
  }
};

export const verifedAttendance = async (
  attendanceId: string,
  eventId: string,
  token: string
): Promise<{
  status: number;
  data: any;
}> => {
  try {
    const id = decodeToken(token);
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        createdById: true,
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
        },
      };
    }

    const isAdmin = event.admins.some((admin) => admin.id === id);
    if (id !== event.createdById && !isAdmin) {
      return {
        status: 403,
        data: {
          message: "Access Denied, you don't have ownership",
        },
      };
    }
    const attendance = await prisma.attendance.findUnique({
      where: {
        id: attendanceId,
        eventId: eventId,
      },
      select: {
        user: true,
        verified: true,
      },
    });
    if (!attendance) {
      return {
        status: 404,
        data: {
          message: "Attendance not found",
        },
      };
    }
    if (attendance.verified == true) {
      return {
        status: 400,
        data: {
          message: "Attendee already verified",
        },
      };
    }
    const user = await prisma.user.findUnique({
      where: {
        id: attendance.user,
      },
      select: {
        name: true,
        email: true,
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
    await prisma.attendance.update({
      where: {
        id: attendanceId,
      },
      data: {
        verified: true,
      },
    });
    return {
      status: 200,
      data: {
        message: "Attendance verified successfully",
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Server error",
      },
    };
  }
};
