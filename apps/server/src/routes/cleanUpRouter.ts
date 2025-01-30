import { Request, Response, Router } from "express";
import prisma from "../utils/PrismaClient";

const cleanUpRouter = Router();

cleanUpRouter.get("/", async (req: Request, res: Response) => {
  try {
    const start = new Date();
    console.log("📦 Database cleanup job started at", new Date().toISOString());

    // Cleanup expired events and their relations
    console.log("🔍 Checking for expired events...");
    const expiredEvents = await prisma.event.findMany({
      where: {
        dateTime: { lt: new Date() },
      },
      select: { id: true },
    });

    if (expiredEvents.length > 0) {
      const eventIds = expiredEvents.map((e) => e.id);
      console.log(`⏳ Found expired events: ${eventIds.join(", ")}`);

      // Delete related data
      console.log("🧹 Removing associated custom fields...");
      await prisma.customField.deleteMany({
        where: { eventId: { in: eventIds } },
      });

      console.log("🎫 Removing associated attendees...");
      await prisma.attendance.deleteMany({
        where: { eventId: { in: eventIds } },
      });

      console.log("⭐ Removing associated reviews...");
      await prisma.review.deleteMany({
        where: { eventId: { in: eventIds } },
      });

      console.log("🗑️ Deleting expired events...");
      await prisma.event.deleteMany({
        where: { id: { in: eventIds } },
      });

      console.log(`✅ Successfully cleaned ${eventIds.length} expired events`);
    } else {
      console.log("✅ No expired events found");
    }

    console.log("🔍 Performing additional cleanup checks...");

    console.log("📱 Cleaning expired OTPs...");
    const deletedOtps = await prisma.otp.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    console.log("✨ Cleanup completed successfully!");
    res.json({
      success: true,
      stats: {
        eventsDeleted: expiredEvents.length,
        otpsDeleted: deletedOtps.count,
        totalTime: new Date().getTime() - start.getTime(),
      },
    });
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    res.status(500).json({
      success: false,
      error: "Cleanup job failed. Check server logs for details.",
    });
  }
});

export default cleanUpRouter;
