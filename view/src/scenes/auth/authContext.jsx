import React, { createContext, useContext, useState } from 'react';

// Create Context for Authentication
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
const [userPermissions, setUserPermissions] = useState(() => {
    const permissions = localStorage.getItem('allPermissionNames');
    return permissions ? JSON.parse(permissions) : [];
});    const [userData, setUserData] = useState(() => {
        const storedUserData = localStorage.getItem('userData');
        return storedUserData && storedUserData !== 'undefined' ? JSON.parse(storedUserData) : null;
    });

    const login = (token, userData, allPermissionNames) => {
        if (!token || !userData) return;
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
localStorage.setItem('allPermissionNames', JSON.stringify(Array.isArray(allPermissionNames) ? allPermissionNames : [allPermissionNames]));

        setToken(token);
        setUserData(userData);
        setUserPermissions(allPermissionNames)

        console.log(allPermissionNames)
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setToken(null);
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ token, userData, setUserPermissions, userPermissions,  login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
