import { GetUser, getUserRegistedEvent, UserEvent } from "../types";
import { decodeToken } from "../utils/DecodeToken";
import prisma from "../utils/PrismaClient";

export const getUser = async (token: string): Promise<GetUser> => {
  try {
    const id = decodeToken(token);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        imgURL: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return {
        status: 404,
        data: {
          message: "User not found",
          user: null,
        },
      };
    }
    const formattedUser = {
      ...user,
      createdAt: user.createdAt.toLocaleString(),
      updatedAt: user.updatedAt.toLocaleString(),
    };

    return {
      status: 200,
      data: {
        message: null,
        user: formattedUser,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Internal server error",
        user: null,
      },
    };
  }
};

export const getUserEvents = async (token: string): Promise<UserEvent> => {
  try {
    const id = decodeToken(token);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        events: true,
      },
    });
    if (!user) {
      return {
        status: 404,
        data: {
          message: "Events not found",
          events: null,
        },
      };
    }
    return {
      status: 200,
      data: {
        message: null,
        events: user.events,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Internal server error",
        events: null,
      },
    };
  }
};

export const updateUser = async (
  token: string,
  name?: string,
  imgURL?: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => {
  try {
    const id = decodeToken(token);
    const dataToUpdate: { name?: string; imgURL?: string } = {};
    if (name) dataToUpdate.name = name;
    if (imgURL) dataToUpdate.imgURL = imgURL;

    await prisma.user.update({
      where: {
        id,
      },
      data: dataToUpdate,
    });
    return {
      status: 200,
      data: {
        message: "User updated successfully",
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

export const UserRegistedEvent = async (
  token: string
): Promise<getUserRegistedEvent> => {
  try {
    const id = decodeToken(token);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return {
        status: 404,
        data: {
          message: "User not found",
          events: null,
        },
      };
    }

    const RegistedEvents = await prisma.event.findMany({
      where: {
        attendees: {
          some: {
            user: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        dateTime: true,
        organization: true,
        createdAt: true,
      },
    });

    return {
      status: 200,
      data: {
        message: null,
        events: RegistedEvents,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Internal server error",
        events: null,
      },
    };
  }
};
