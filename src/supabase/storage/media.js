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

export const deleteAllFilesInFolder = async (id) => {
    const { data, error: listError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list(id, { recursive: true });

    if (listError) {
        console.error("Failed to list files in folder:", listError);
        throw listError;
    }

    if (!data || data.length === 0) {
        console.log("No files found to delete in folder:", id);
        return;
    }

    const filePaths = data.map(file => `${id}/${file.name}`);

    const { error: deleteError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .remove(filePaths);

    if (deleteError) {
        console.error("Failed to delete files:", deleteError);
        throw deleteError;
    }

    console.log(`Deleted ${filePaths.length} file(s) from folder: ${id}`);
};
