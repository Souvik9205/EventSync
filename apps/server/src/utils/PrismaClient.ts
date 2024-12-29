import client from "@prisma/client";

export const prisma = new client.PrismaClient();
export default prisma;
