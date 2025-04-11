import "./Login.css";
import LoadingSpinner from "../components/common/LoadingSpinner";
import googleLogo from "../assets/google-logo.png";

const Login = ({onSignIn, loading}) => {
    return (
        <div className="login-page">
            <button
                className="login-button"
                onClick={onSignIn}
                disabled={loading}
            >
                <img src={googleLogo} alt="Google logo" className="google-logo" />
                <span>Continue with Google</span>
                {loading && <LoadingSpinner size={18} color="white"/>}
            </button>
        </div>
    );
};

export default Login;
