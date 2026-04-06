import cloudinary from "./cloudinary.js";
import fs from "fs/promises";

export const uploadToCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto", folder: "profiles", // organized storage
        });
        //File has been uploaded
        await fs.unlink(localFilePath);
        
        return {
            url: response.secure_url,
            public_id: response.public_id
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        try {
            await fs.unlink(localFilePath);
        } catch (err) {
            console.error("File delete failed:", err);
        }
        return null;
    }
}