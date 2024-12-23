import './Avatar.css';
import placeholderAvatar from '../assets/placeholder-avatar.png';

const Avatar = ({ src, size }) => {
  return (
    <img
      src={src || placeholderAvatar}
      alt="Avatar"
      className="avatar"
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;
