import React, { createContext, useState, useContext } from "react";

interface UserType {
    username: string;
    // add other user fields if needed
}

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null, user?: UserType | null) => void;
    user: UserType | null;
    setUser: (user: UserType | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => {},
    user: null,
    setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [token, setTokenState] = useState<string | null>(() =>
        localStorage.getItem("token")
    );
    const [user, setUserState] = useState<UserType | null>(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const setToken = (newToken: string | null, newUser?: UserType | null) => {
        setTokenState(newToken);
        if (newToken) localStorage.setItem("token", newToken);
        else localStorage.removeItem("token");
        if (newUser !== undefined) {
            setUserState(newUser);
            if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
            else localStorage.removeItem("user");
        }
    };

    const setUser = (newUser: UserType | null) => {
        setUserState(newUser);
        if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
        else localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
