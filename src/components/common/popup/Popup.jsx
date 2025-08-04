import React from "react";
import "./Popup.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";

const Popup = ({children, onClose, width}) => {
    return (
        <div className="popup-overlay">
            <div className="popup" style={{width: width}}>
                <div className="popup-close" onClick={onClose}>
                    <FontAwesomeIcon icon={faClose}/>
                </div>
                <div className="popup-content">{children}</div>
            </div>
        </div>
    );
};

export default Popup;
