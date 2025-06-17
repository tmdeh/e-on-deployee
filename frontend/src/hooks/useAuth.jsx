import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const { user, setUser, loading, login, signup, logout } = useContext(AuthContext);
  return {
    user,
    setUser,
    loading,  
    signup,
    login,
    logout,
    isLoggedIn: !!user && !loading  // 로그인 중 + 로딩 끝났을 때만 true
  };
}
