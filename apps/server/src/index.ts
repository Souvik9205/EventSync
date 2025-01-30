import express from "express";
import cors from "cors";

import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import eventRouter from "./routes/eventRouter";
import registerRouter from "./routes/attendenceRouter";
import OTPVerifyRouter from "./routes/otpVerifyRouter";
import scanRouter from "./routes/scanRoutes";
import cleanUpRouter from "./routes/cleanUpRouter";

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin:
      FRONTEND_URL &&
      "http://localhost:3000" &&
      "https://event-sync-frontend-rho.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api", registerRouter);
app.use("/api/otp", OTPVerifyRouter);
app.use("/api/scan", scanRouter);
const PORT = 8080;

app.get("/", (req, res) => {
  res.send("Hello from EventSync!");
});
app.use("/api/cleanup", cleanUpRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
