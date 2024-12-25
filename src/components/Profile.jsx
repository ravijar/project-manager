import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import "./Profile.css";
import Avatar from "./Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

const Profile = ( ) => {
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="profile-container">
      <Avatar size={100} />
      <div className="profile-name">{user.displayName}</div>
      <div className="signout-icon" onClick={handleSignOut}>
        <FontAwesomeIcon icon={faPowerOff} />
      </div>
    </div>
  );
};

export default Profile;
