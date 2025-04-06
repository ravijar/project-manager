import "./Login.css";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {useState} from "react";

const Login = ({onSignIn, loading}) => {
    const [selectedRole, setSelectedRole] = useState("student");

    const handleSignIn = () => {
        onSignIn(selectedRole);
    };

    return (
        <div className="login-page">
            <h1>Welcome to Chat App</h1>
            <div className="role-selection">
                <label>
                    <input
                        type="radio"
                        value="student"
                        checked={selectedRole === "student"}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    />
                    Student
                </label>
                <label>
                    <input
                        type="radio"
                        value="tutor"
                        checked={selectedRole === "tutor"}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    />
                    Tutor
                </label>
            </div>

            <button
                className="login-button"
                onClick={handleSignIn}
                disabled={loading}
            >
                <span>Sign in</span>
                {loading && <LoadingSpinner size={18} color="white"/>}
            </button>
        </div>
    );
};

export default Login;
