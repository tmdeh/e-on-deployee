// backend/controllers/auth.js
const VALID_USER_TYPES = ["student", "parent"];
const bcrypt = require("bcrypt");
const passport = require("passport");
const transporter = require("../config/mail");
const User = require("../models/User");

// 1단계: 회원 구분 저장
exports.signupStep1 = (req, res) => {
    const { userType } = req.body;
    // 1) 관리자는 접근 차단
    if (userType === "admin") {
        return res.status(403).json({ message: "권한이 없습니다." });
    }
    // 2) 학생/부모가 아니면 에러
    if (!VALID_USER_TYPES.includes(userType)) {
        return res
            .status(400)
            .json({ message: "유효하지 않은 회원 유형입니다." });
    }

    // 세션에 저장
    req.session.signup = { type: userType };
    // res.json({ success: true });
    req.session.save(() => {
        res.json({ success: true });
    });

    console.log("🔥 [STEP1] 세션 전체:", req.session);
};

// 2단계: 약관 동의 저장
exports.signupStep2 = (req, res) => {
    if (!req.session.signup) {
        return res.status(400).json({ message: "Step1 먼저 진행해주세요." });
    }
    req.session.signup.agreements = req.body.agreements;
    // res.json({ success: true });
    req.session.save(() => {
        console.log("🔥 [STEP2] 세션 전체:", req.session);
        res.json({ success: true });
    });
};

// 이메일 인증번호 발송
exports.sendEmailCode = async (req, res, next) => {
    try {
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 세션 초기화 + 저장
        req.session.emailCode = code;
        req.session.emailForCode = req.body.email;

        await transporter.sendMail({
            from: `"E-ON" <${process.env.SMTP_USER}>`,
            to: req.body.email,
            subject: "E-ON 이메일 인증번호",
            html: `<p>인증번호: <strong>${code}</strong></p>`,
        });

        // 🔥 세션 강제 저장
        req.session.save(() => {
            console.log("📮 인증번호 세션 저장 완료:", code);
            res.json({ success: true });
        });
    } catch (err) {
        next(err);
    }
};

// 이메일 인증번호 검증
exports.verifyEmailCode = (req, res) => {
    if (
        req.body.email !== req.session.emailForCode ||
        req.body.code !== req.session.emailCode
    ) {
        return res.status(400).json({
            success: false,
            message: "이메일 또는 코드가 일치하지 않습니다.",
        });
    }
    res.json({ success: true });
};

// 3단계: 실제 회원 생성
exports.signupStep3 = async (req, res, next) => {
    console.log("🔥 [STEP3] 세션 전체:", req.session);
    const { name, email, code, password, confirm, age } = req.body;
    const su = req.session.signup || {};

    // 1단계/2단계 확인
    if (!su.type || !su.agreements) {
        // 세션 정리
        clearSignupSession(req);
        return res
            .status(400)
            .json({ message: "이전 단계가 완료되지 않았습니다." });
    }
    // 이메일·코드 확인
    if (email !== req.session.emailForCode || code !== req.session.emailCode) {
        // 세션 정리
        clearSignupSession(req);
        return res.status(400).json({ message: "이메일 또는 인증 코드 오류" });
    }
    // 비밀번호 확인
    if (password !== confirm) {
        // 세션 정리
        clearSignupSession(req);
        return res
            .status(400)
            .json({ message: "비밀번호와 확인이 일치하지 않습니다." });
    }

    try {
        // 중복 이메일 체크
        if (await User.findOne({ where: { email } })) {
            // 세션 정리
            clearSignupSession(req);
            return res
                .status(409)
                .json({ message: "이미 사용 중인 이메일입니다." });
        }

        // 회원 생성 (password 필드에 hook이 걸려 있어 자동 해시됨)
        const newUser = await User.create({
            name,
            email,
            age,
            password,
            // nickname: name, // 테이블 구조와 달라서 주석 처리
            state_code: "active",
            type: su.type, // User 모델의 'type' 컬럼
            agreements: su.agreements, // JSON 컬럼
        });

        // 회원가입 성공 시 세션 정리
        clearSignupSession(req);

        res.status(201).json({ success: true, user: newUser.toJSON() });
    } catch (err) {
        next(err);
    }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    try {
      const foundUser = await User.findByPk(user.user_id);
      console.log("🧨 로그인 시도 유저:", {
        id: user.user_id,
        email: foundUser.email,
        accountStatus: foundUser.state_code,
      });

      // 강제 차단 테스트
      if (!foundUser) {
        console.log("❌ DB에서 유저 못 찾음");
        return res.status(403).json({ message: '유저 없음' });
      }

      if (foundUser.state_code !== 'active') {
        console.log("🚫 비활성화 계정 로그인 시도 차단됨");
        return res.status(403).json({ message: '비활성화된 계정입니다.' });
      }

      req.login(foundUser, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.json({ success: true, user: foundUser.toJSON() });
      });
    } catch (e) {
      return next(e);
    }
  })(req, res, next);
};



// 로그아웃
exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.json({ success: true, message: "로그아웃 되었습니다." });
        });
    });
};

// exports.refresh = async (req, res) => {
//   const userId = req.session.passport.user;
//   const user = await User.findByPk(userId);
//   return res.json({success: true, user: user.toJSON()});
// }

// 🔧 공통 세션 정리 함수
function clearSignupSession(req) {
    delete req.session.signup;
    delete req.session.emailCode;
    delete req.session.emailForCode;
    console.log("🔥 세션 정리됨:", req.session);
}
