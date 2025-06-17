// src/pages/MyPage/MyPage.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../styles/MyPage/Mypage.module.css";

export default function MyPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>로딩 중...</p>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className={styles.container}>
      <h2>마이페이지</h2>
      <div className={styles.userInfo}>
        <p><strong>{user.name}</strong></p>
        <p>{user.email}</p>
      </div>

      <div className={styles.menuGrid}>
        <Link to="/mypage/info" className={styles.menuBox}>내 정보 수정</Link>
        <Link to="/mypage/password" className={styles.menuBox}>비밀번호 변경</Link>
        <Link to="/mypage/deactivate" className={styles.menuBox}>계정 탈퇴 / 비활성화</Link>
      </div>
    </div>
  );
}
