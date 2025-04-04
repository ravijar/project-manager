import Login from './pages/Login';
import './App.css';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import { getStoredUser, signIn, signOut } from './services/authService';


const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSignIn = async (role) => {
      setLoading(true);
      try {
        const loggedUser = await signIn(role);
        setUser(loggedUser);
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setLoading(false);
      }
    };

  const handleSignOut = async () => {
      try {
        await signOut();
        setUser(null);
      } catch (error) {
        console.error("Error signing out:", error);
      }
  };

  if (!user) {
    return <Login onSignIn={handleSignIn} loading={loading} />;
  }

  return (
    <Home user={user} handleSignOut={handleSignOut} />
  );
};

export default App;
