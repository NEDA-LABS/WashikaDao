// useCloudinaryUpload.ts
export const useCloudinaryUpload = () => {
  /**
   * Uploads a file to Cloudinary and returns its secure URL.
   * @param file The file to upload.
   * @param resourceType The type of resource to upload (e.g., "raw" or "image").
   *                     Defaults to "raw".
   * @returns A promise resolving to the secure URL or null on error.
   */
  const uploadFileToCloudinary = async (
    file: File,
    resourceType: string = "raw"
  ): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    // Build the upload URL dynamically based on resourceType.
    const uploadUrl = `https://api.cloudinary.com/v1_1/da50g6laa/${resourceType}/upload`;

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.secure_url || null;
    } catch (error) {
      console.error(`Error uploading ${resourceType} file:`, error);
      return null;
    }
  };

  return { uploadFileToCloudinary };
};
