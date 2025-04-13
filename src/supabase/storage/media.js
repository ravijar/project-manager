import {supabase} from "../config";

const BUCKET_NAME = "media";

export const uploadFileToBucket = async (file, fileName, id) => {
    const filePath = `${id}/${fileName}`;
    const {data, error} = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

    if (error) throw error;

    const {data: publicUrlData} = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
};

export const deleteFileFromBucket = async (fileName, id) => {
    const filePath = `${id}/${fileName}`;
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

    if (error) {
        console.error("Failed to delete file:", error);
        throw error;
    }
};
