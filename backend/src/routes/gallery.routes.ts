import { Router } from "express";
import { getGallery } from "../controllers/gallery.controller.js";

const galleryRouter = Router();

galleryRouter.get("/gallery", getGallery);

export default galleryRouter;
