// src/pages/MyPage/MyInfo.jsx
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useAuth } from '../../hooks/useAuth';

export default function MyInfo() {
  const { user, setUser } = useAuth();
  const [name, setName]                       = useState('');
  const [nickname, setNickname]               = useState('');
  const [emailNotification, setEmailNotification] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage]                 = useState({ type: '', text: '' });

  // 초기값 세팅
  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setNickname(user.nickname ?? '');
      setEmailNotification(user.emailNotification ?? true);
    }
  }, [user]);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      // PUT /api/user/me 에 name, nickname, emailNotification, currentPassword 전송
      const res = await api.put('/api/user/me', {
        name,
        emailNotification,
        currentPassword
      });
      setMessage({ type: 'success', text: res.data.message });

      console.log({res});

      // 변경된 내 정보 다시 조회해서 Context 갱신
      const me = await api.get('/api/user/me');
      setUser(me.data.user);
      
      // 비밀번호 입력란 초기화
      setCurrentPassword('');
    } catch (err) {
      console.log(err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || '수정에 실패했습니다.'
      });
    }
  };

  if (!user) return <p>로딩 중...</p>;

  return (
    <div>
      <h3>내 정보 관리</h3>

      {message.text && (
        <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>이메일</label><br/>
          <input type="email" value={user.email} disabled />
        </div>

        <div>
          <label>이름</label><br/>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <label>닉네임</label><br/>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
        </div>

        <div>
          <label>이메일 알림</label><br/>
          <input
            type="checkbox"
            checked={emailNotification}
            onChange={e => setEmailNotification(e.target.checked)}
          />
        </div>

        <div>
          <label>현재 비밀번호</label><br/>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>
          저장하기
        </button>
      </form>
    </div>
  );
}
