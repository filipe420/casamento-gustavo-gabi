import type { Request, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "../services/storage.service.js";
import { addGalleryItem } from "../store/gallery.store.js";
import type { GalleryItem } from "../types/gallery.types.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(new Error("Formato inválido. Use JPG, PNG ou WEBP."));
    return;
  }

  callback(null, true);
};

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
}).single("image");

export const uploadImageController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Arquivo é obrigatório." });
      return;
    }

    const publicUrl = await uploadImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const uploaderName = typeof req.body?.uploaderName === "string" ? req.body.uploaderName.trim() : "";

    const item: GalleryItem = {
      id,
      name: uploaderName || req.file.originalname,
      url: publicUrl,
      createdAt,
    };

    addGalleryItem(item);

    res.status(201).json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao fazer upload.";
    res.status(500).json({ message });
  }
};
