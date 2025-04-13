import {v4 as uuidv4} from "uuid";
import {deleteAllFilesInFolder, deleteFileFromBucket, uploadFileToBucket} from "../supabase/storage/mediaBucket.js";

export const generateStoredFileName = (originalName) => {
    const uuid = uuidv4();
    const lastDotIndex = originalName.lastIndexOf(".");
    const namePart = originalName.slice(0, lastDotIndex);
    const extPart = originalName.slice(lastDotIndex);
    return `${namePart}--UUID--${uuid}${extPart}`;
};

export const getOriginalFileName = (storedFileName) => {
    const uuidSeparator = "--UUID--";
    const extIndex = storedFileName.lastIndexOf(".");
    const extension = storedFileName.slice(extIndex);
    const nameWithEncoded = storedFileName.split(uuidSeparator)[0];
    return decodeURIComponent(`${nameWithEncoded}${extension}`);
};

export const getFileNameFromUrl = (url) => {
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1]);
}

export const uploadFile = async (file, id) => {
    return await uploadFileToBucket(file, generateStoredFileName(file.name), id);
};

export const deleteFile = async (fileName, id) => {
    return await deleteFileFromBucket(fileName, id);
}

export const deleteFolder = async (folderName) => {
    return await deleteAllFilesInFolder(folderName);
}
