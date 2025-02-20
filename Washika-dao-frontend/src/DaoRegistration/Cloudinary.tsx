export const uploadFileToCloudinary = async (
  file: File,
  resourceType: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  const uploadUrl = `https://api.cloudinary.com/v1_1/da50g6laa/${resourceType}/upload`;

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url || null; // Return the uploaded file's URL
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};
