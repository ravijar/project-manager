import Login from './pages/Login';
import './App.css';
import { useState, useEffect } from 'react';
import { googleSignIn, commonSignOut } from './firebase/authService';
import Home from './pages/Home';


const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignIn = async () => {
      try {
        const loggedUser = await googleSignIn();
        setUser(loggedUser)
        localStorage.setItem("user", JSON.stringify(loggedUser));
      } catch (error) {
        console.error("Login failed:", error);
      }
    };

  const handleSignOut = async () => {
      try {
        await commonSignOut();
        localStorage.removeItem("user");
        setUser(null);
      } catch (error) {
        console.error("Error signing out:", error);
      }
  };

  if (!user) {
    return <Login onSignIn={handleSignIn} />;
  }

  return (
    <Home user={user} handleSignOut={handleSignOut} />
  );
};

export default App;
