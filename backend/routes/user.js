// backend/routes/user.js
const express = require('express');
const {
  getMyInfo,
  updateMyInfo,
  changePassword,
  deactivateAccount,
  deleteAccount
} = require('../controllers/user');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

// 내 정보 조회
router.get('/me', isLoggedIn, getMyInfo);

// 내 정보 수정
router.put('/me', isLoggedIn, updateMyInfo);

// 비밀번호 변경
router.put('/me/password', isLoggedIn, changePassword);

// 계정 비활성화
router.patch('/me/deactivate', isLoggedIn, deactivateAccount);

// 계정 삭제
router.delete('/me', isLoggedIn, deleteAccount)

module.exports = router;
