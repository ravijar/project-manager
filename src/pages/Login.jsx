import "./Login.css";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Login = ({ onSignIn, loading }) => {

  return (
    <div className="login-page">
      <h1>Welcome to Chat App</h1>
      <button 
        className="login-button" 
        onClick={onSignIn}
        disabled={loading}
      >
        <span>Sign in</span> 
        {loading && <LoadingSpinner size={18} color="white" />}
      </button>
    </div>
  );
};

export default Login;
