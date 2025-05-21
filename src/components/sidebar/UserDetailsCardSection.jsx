import UserDetailsCard from "./UserDetailsCard";
import "./UserDetailsCardSection.css";

const UserDetailsCardSection = ({users, onUserClick}) => {
    if (!users || users.length === 0) return null;

    return (
        <div className="card-section">
            {users.map((user) => (
                <UserDetailsCard
                    key={user.id}
                    name={user.name}
                    email={user.email}
                    role={user.role}
                    avatarSrc={user.photoURL}
                    onClick={() => onUserClick(user)}
                />
            ))}
        </div>
    );
};

export default UserDetailsCardSection;
