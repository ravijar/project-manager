import {v4 as uuidv4} from "uuid";
import {uploadFile} from "../supabase/storage/media.js";

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
    const nameWithoutUuid = storedFileName.split(uuidSeparator)[0];
    return `${nameWithoutUuid}${extension}`;
};

export const uploadChatFile = async (file, chatId) => {
    return await uploadFile(file, generateStoredFileName(file.name), chatId);
};
