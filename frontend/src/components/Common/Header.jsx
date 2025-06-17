import React from 'react';
import styles from "./../../styles/Common/Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import notification from "../../assets/notification.svg";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link to="/" className={styles.logoLink}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                </Link>
            </div>
            <div className={styles.navContainer}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <Link to="/calendar" className={styles.navLink}>
                            학사 일정
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/challenge" className={styles.navLink}>
                            챌린지
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/recommendation/time" className={styles.navLink}>
                            AI 맞춤 추천
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/community" className={styles.navLink}>
                            커뮤니티
                        </Link>
                    </li>

                    {user ? (
                        <>   
                        <li className={styles.navItem}>
                            <Link to={`/mypage`} className={styles.navLink}>
                                마이페이지
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className={`${styles.navItem} ${styles.navLink}`}
                            >
                                로그아웃
                            </button>
                        </li>
                        </>
                    ) : (
                        <li className={styles.navItem}>
                            <Link to="/login" className={styles.navLink}>
                                로그인/회원가입
                            </Link>
                        </li>
                    )}

                    <li className={styles.navItem}>
                        <img
                            src={notification}
                            alt="Notification"
                            className={styles.notification}
                        />
                    </li>
                </ul>
            </div>
        </header>
    );
}
