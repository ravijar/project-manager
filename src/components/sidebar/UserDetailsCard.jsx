import React from 'react';
import './UserDetailsCard.css';
import Avatar from "../common/Avatar.jsx";

const UserDetailsCard = ({name, email, role, avatarSrc, onClick}) => {
    return (
        <div className="user-details-card" onClick={onClick}>
            <Avatar src={avatarSrc} size={50}/>
            <div className="user-info">
                <div className="user-name">{name}</div>
                <div
                    className="user-email"
                    title={email}
                >
                    {email}
                </div>
                <div className="user-role">{role}</div>
            </div>
        </div>
    );
};

export default UserDetailsCard;
