import { Router } from "express";
import { uploadImageController, uploadMiddleware } from "../controllers/upload.controller.js";

const uploadRouter = Router();

uploadRouter.post("/upload", uploadMiddleware, uploadImageController);

export default uploadRouter;
