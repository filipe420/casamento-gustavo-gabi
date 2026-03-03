import { v4 as uuidv4 } from "uuid";
import { bucket } from "../config/firebase.js";

export const uploadImage = async (
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> => {
  const sanitized = filename.replace(/\s+/g, "-").toLowerCase();
  const uniqueName = `gallery/${uuidv4()}-${sanitized}`;
  const file = bucket.file(uniqueName);

  await file.save(buffer, {
    metadata: {
      contentType,
      cacheControl: "public, max-age=31536000",
    },
    resumable: false,
  });

  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${uniqueName}`;
};
