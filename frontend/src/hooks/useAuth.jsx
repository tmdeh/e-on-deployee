import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const { user, loading } = useContext(AuthContext);
  return {
    user,
    loading,
    isLoggedIn: !!user && !loading  // 로그인 중 + 로딩 끝났을 때만 true
  };
}
