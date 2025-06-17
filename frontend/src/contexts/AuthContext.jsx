// src/contexts/AuthContext.jsx
import { createContext, useState } from 'react';

export const AuthContext = createContext();

// 마이페이지 리다이렉션 문제 해결 
// AuthContext에서 user === undefined 상태랑 loading을 구분해서 제공 
function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // 
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
    const refresh = async() => {
      console.log("🔁 refresh called");
      try {
        const res = await api.get('/auth/refresh');
        console.log("✅ refresh success", res.data.user);
        setUser(res.data.user);
      } catch {
        console.log("❌ refresh failed");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user,loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
