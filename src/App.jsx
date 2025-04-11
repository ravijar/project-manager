import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';
import {getStoredUser, signIn, signOut} from './services/authService';
import {useState, useEffect} from "react";

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        const storedUser = getStoredUser();
        if (storedUser) setUser(storedUser);
    }, []);

    const handleSignIn = async () => {
        if (!selectedRole) return;
        setLoading(true);
        try {
            const loggedUser = await signIn(selectedRole);
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

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PublicRoute user={user}>
                            <Home setSelectedRole={setSelectedRole} />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoute user={user} selectedRole={selectedRole}>
                            <Login onSignIn={handleSignIn} loading={loading} />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute user={user}>
                            <Dashboard user={user} handleSignOut={handleSignOut} />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
