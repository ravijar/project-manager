const RoleBased = ({roles = [], currentRole, children}) => {
    if (roles.includes(currentRole)) {
        return children;
    }
    return null;
};

export default RoleBased;