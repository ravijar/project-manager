import {supabase} from "../config";

const BUCKET_NAME = "media";

export const uploadFile = async (file, fileName, chatId) => {
    const filePath = `${chatId}/${fileName}`;
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
};
