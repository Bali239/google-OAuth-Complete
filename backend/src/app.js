import express from "express"
import cors from "cors"
import googleRoutes from "./routes/google.routes.js"
import cookieParser from "cookie-parser";


const app = express()
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json())
app.use("/api/auth", googleRoutes)

export default app;

