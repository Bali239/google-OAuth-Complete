import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/google.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);

export default app;

