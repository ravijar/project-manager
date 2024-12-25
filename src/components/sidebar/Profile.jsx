import "./Profile.css";
import Avatar from "../common/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

const Profile = ({ user, onSignOut }) => {

  return (
    <div className="profile-container">
      <Avatar size={100} />
      <div className="profile-name">{user.displayName}</div>
      <div className="signout-icon" onClick={onSignOut}>
        <FontAwesomeIcon icon={faPowerOff} />
      </div>
    </div>
  );
};

export default Profile;
