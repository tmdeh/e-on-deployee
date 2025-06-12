const express = require('express');
const router  = express.Router();
const authCtrl = require('../controllers/auth');
const { isNotLoggedIn } = require('../middleware/auth');

router.post('/join/step1',    isNotLoggedIn, authCtrl.signupStep1);
router.post('/join/step2',    isNotLoggedIn, authCtrl.signupStep2);
router.post('/join/email',    isNotLoggedIn, authCtrl.sendEmailCode);
router.post('/verify-email',  isNotLoggedIn, authCtrl.verifyEmailCode);
router.post('/join/step3',    isNotLoggedIn, authCtrl.signupStep3);

// 로그인
router.post('/login', authCtrl.login);

// 로그아웃
router.post('/logout', authCtrl.logout);

router.get("/refresh", authCtrl.refresh)

module.exports = router;
