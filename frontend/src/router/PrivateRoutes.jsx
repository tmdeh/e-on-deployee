// 권한 검사 후 로그인 된 사용자만 접근할 수 있도록 함
// src/routes/PrivateRoutes.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoutes = ({ children }) => {
    const { user } = useAuth();
    // 로그인 된 상태면 children을 보여주고, 로그인 안된 상태면 로그인 페이지로 이동
    return user ? children : <Navigate to="/login" />;
}

export default PrivateRoutes;