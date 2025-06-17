import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoutes = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>로딩 중...</div>;  // ✅ refresh() 중일 땐 대기

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoutes;
