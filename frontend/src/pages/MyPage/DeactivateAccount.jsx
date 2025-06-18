// src/pages/MyPage/DeactivateAccount.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function DeactivateAccount() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [action, setAction] = useState('deactivate'); // 'deactivate' | 'delete'
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!currentPassword) {
      setMsg({ type: 'error', text: '현재 비밀번호를 입력해주세요.' });
      return;
    }
    try {
      if (action === 'deactivate') {
        const res = await api.delete('/api/user/me', { currentPassword });
        setMsg({ type: 'success', text: res.data.message });
      } else {
        const res = await api.patch('/api/user/me', { data: { currentPassword } });
        setMsg({ type: 'success', text: res.data.message });
      }
      // 성공 시 2초 후 홈으로 이동
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || '처리에 실패했습니다.'
      });
    }
  };

  return (
    <div>
      <h3>계정 {action === 'deactivate' ? '비활성화' : '탈퇴'}</h3>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          <input
            type="radio"
            name="action"
            value="deactivate"
            checked={action === 'deactivate'}
            onChange={() => setAction('deactivate')}
          />
          비활성화
        </label>
        <label>
          <input
            type="radio"
            name="action"
            value="delete"
            checked={action === 'delete'}
            onChange={() => setAction('delete')}
          />
          탈퇴
        </label>
      </div>

      {msg.text && (
        <p style={{ color: msg.type === 'error' ? 'red' : 'green' }}>
          {msg.text}
        </p>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label>현재 비밀번호</label>
        <input
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>
        {action === 'deactivate' ? '계정 비활성화' : '회원 탈퇴'}
      </button>
    </div>
  );
}
