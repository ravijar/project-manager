import "./Home.css";
import { useNavigate } from "react-router-dom";
import studentImg from "../assets/student.jpg";
import tutorImg from "../assets/tutor.jpg";
import adminImg from "../assets/admin.jpg";

const Home = ({ setSelectedRole }) => {
    const navigate = useNavigate();

    const handleSelectRole = (role) => {
        setSelectedRole(role);
        navigate("/login");
    };

    return (
        <div className="home-container">
            <div className="role-box student" onClick={() => handleSelectRole("student")}>
                <div className="role-image" style={{ backgroundImage: `url(${studentImg})` }}></div>
                <div className="role-label">
                    <div className="subtext">Continue as</div>
                    Student
                </div>
            </div>
            <div className="role-box tutor" onClick={() => handleSelectRole("tutor")}>
                <div className="role-image" style={{ backgroundImage: `url(${tutorImg})` }}></div>
                <div className="role-label">
                    <div className="subtext">Continue as</div>
                    Tutor
                </div>
            </div>
            <div className="role-box admin" onClick={() => handleSelectRole("admin")}>
                <div className="role-image" style={{ backgroundImage: `url(${adminImg})` }}></div>
                <div className="role-label">
                    <div className="subtext">Continue as</div>
                    Admin
                </div>
            </div>
        </div>
    );
};

export default Home;
