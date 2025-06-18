import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useAuth() {
    const { user, setUser, loading, signup, login, logout } = useContext(AuthContext);
    return {
        user,
        setUser,
        loading,
        isLoggedIn: !!user && !loading,
        signup,
        login,
        logout,
    };
}
