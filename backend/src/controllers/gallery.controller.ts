import type { Request, Response } from "express";
import { getGalleryItems } from "../store/gallery.store.js";

export const getGallery = (_req: Request, res: Response): void => {
  res.status(200).json(getGalleryItems());
};
