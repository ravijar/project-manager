import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import "./Login.css";

const Login = ({ onLoginSuccess }) => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLoginSuccess(user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-page">
      <h1>Welcome to Chat App</h1>
      <button className="login-button" onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
