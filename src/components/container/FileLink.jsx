import {getFileNameFromUrl, getOriginalFileName} from "../../services/fileService.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFile, faDownload} from "@fortawesome/free-solid-svg-icons";

const FileLink = ({url}) => {
    try {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFile} style={{marginRight: 6}}/>
                {getOriginalFileName(getFileNameFromUrl(url))}
            </a>
        );
    } catch (err) {
        console.error("Failed to extract file name:", err);
        return (
            <a href={url} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faDownload} style={{marginRight: 6}}/>
                Download File
            </a>
        );
    }
};

export default FileLink;
