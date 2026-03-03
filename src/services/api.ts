import axios from "axios";

export interface GalleryImage {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
});

export const uploadImage = async (file: File, uploaderName?: string): Promise<GalleryImage> => {
  const formData = new FormData();
  formData.append("image", file);

  if (uploaderName?.trim()) {
    formData.append("uploaderName", uploaderName.trim());
  }

  const response = await api.post<GalleryImage>("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getGallery = async (): Promise<GalleryImage[]> => {
  const response = await api.get<GalleryImage[]>("/api/gallery");
  return response.data;
};

export default api;
