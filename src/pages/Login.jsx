import "./Login.css";
import LoadingSpinner from "../components/common/loading-spinner/LoadingSpinner.jsx";
import googleLogo from "../assets/google-logo.png";

const Login = ({onSignIn, loading, error, selectedRole}) => {
    return (
        <div className="login-page">
            <div className="login-form">
                <div className="login-content">
                    <h2 className="login-title">Sign in to your account</h2>
                    <div className="role-info">
                        {loading && <LoadingSpinner size={8} color="#666666"/>}
                        You're signing in as <strong>{selectedRole}</strong>
                    </div>

                    <button
                        className="login-button"
                        onClick={onSignIn}
                        disabled={loading}
                    >
                        <img src={googleLogo} alt="Google logo" className="google-logo"/>
                        <span>Continue with Google</span>
                    </button>

                    {error && <p className="login-error">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Login;
