import express from "express";
import cors from "cors";

import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import eventRouter from "./routes/eventRouter";

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Configure CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
const PORT = 8080;

app.get("/", (req, res) => {
  res.send("Hello from QrGanize!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
