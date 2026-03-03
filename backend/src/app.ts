import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import uploadRouter from "./routes/upload.routes.js";
import galleryRouter from "./routes/gallery.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/api", uploadRouter);
app.use("/api", galleryRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
