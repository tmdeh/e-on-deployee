import { createContext, useEffect, useState } from "react";
import api from "../api/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const signup = async ({ name, email, age, code, password, confirm }) => {
    const res = await api.post('/auth/join/step3', {
      name, email, age, code, password, confirm
    });
    setUser(res.data.user);
    return res.data;
  };

  const login = async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await api.get('/auth/refresh');
        setUser(res.data.user);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };
    refresh();
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
