import {Navigate, useLocation} from "react-router-dom";

const PublicRoute = ({user, selectedRole, children}) => {
    const location = useLocation();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    if (location.pathname === "/login" && !selectedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
