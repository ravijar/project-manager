import "./Profile.css";
import Avatar from "../common/Avatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPowerOff} from "@fortawesome/free-solid-svg-icons";

const Profile = ({user, onSignOut}) => {

    return (
        <div className="profile-container">
            <Avatar src={user.photoURL} size={80}/>
            <div className="profile-name">{user.name}</div>
            <div className="profile-role">{user.role}</div>
            <div className="signout-icon" onClick={onSignOut}>
                <FontAwesomeIcon icon={faPowerOff}/>
            </div>
        </div>
    );
};

export default Profile;
