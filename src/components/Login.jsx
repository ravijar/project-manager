import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import "./Login.css";

const Login = ({ onSignIn }) => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: Timestamp.fromDate(new Date(user.metadata.lastSignInTime)),
      });

      onSignIn(user);
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
