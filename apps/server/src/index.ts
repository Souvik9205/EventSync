import express from "express";
import cors from "cors";

import authRouter from "./routes/authRouter";

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

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
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello from QrGanize!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
