import "./Login.css";

const Login = ({ onSignIn }) => {

  return (
    <div className="login-page">
      <h1>Welcome to Chat App</h1>
      <button className="login-button" onClick={onSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
