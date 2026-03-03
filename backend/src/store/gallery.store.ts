import type { GalleryItem } from "../types/gallery.types.js";

const galleryItems: GalleryItem[] = [];

export const addGalleryItem = (item: GalleryItem): void => {
  galleryItems.unshift(item);
};

export const getGalleryItems = (): GalleryItem[] => {
  return galleryItems;
};
