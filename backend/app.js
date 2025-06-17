// app.js
require('dotenv').config();                // 환경변수 로드
const express = require('express');
const path    = require('path');
const cors    = require('cors');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// DB 연결 (rawConnection은 기존 쿼리용, sequelize는 Sequelize ORM용)
const { rawConnection: db, sequelize } = require('./database/db.js');

// Passport 설정 (local, kakao, google, naver)
require('./config/passport')();

const app = express();

// 프록시 환경에서 사용 
app.set('trust proxy', 1);

// 업로드 폴더 정적 서빙
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS 설정 (클라이언트 도메인 허용)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // 세션 + Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({ db: sequelize }),  // 세션을 DB에 저장
  cookie: { httpOnly: true, secure: false }      // HTTPS 환경이면 secure: true
}));
app.use(passport.initialize());
app.use(passport.session());

// ───────────────────────────────────────────────
// 인증 라우트
app.use('/auth', require('./routes/auth'));

app.use('/api/user',      require('./routes/user'));
app.use('/api/interests', require('./routes/interest'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/notification', require('./routes/notification'));


app.use('/schoolSchedule',         require('./routes/schoolScheduleRoute'));
app.use('/averageSchedule',        require('./routes/averageScheduleRouter'));
app.use('/regions',                require('./routes/regionRouter'));
app.use('/boards',                 require('./routes/boardRoute'));

app.use('/api/recommendations',       require('./routes/recommendations'));
app.use('/api/preferences',           require('./routes/preferencesRoutes'));
app.use('/api/select',                require('./routes/select'));
app.use('/api/time-recommendations',  require('./routes/timeRecommendations'));
app.use('/api/challenges',            require('./routes/challengeRoutes'));
app.use('/api/participations',         require('./routes/participationRoutes'));
app.use('/api/attendances',            require('./routes/attendance'));
app.use('/api/reviews',               require('./routes/reviewRoutes'));
app.use('/api/attachments',           require('./routes/attachmentRoutes'));
app.use('/api/visions',               require('./routes/visions'));

// 테스트용 헬로우 엔드포인트
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

// 에러 핸들러 (마지막에)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;