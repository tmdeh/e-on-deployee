const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');


module.exports = () => {

  passport.serializeUser((user, done) => {
    done(null, user.user_id)
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (e) {
      done(e);
    }
  });

  // Local
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.scope('withPassword').findOne({ where: { email } });
        if (!user) return done(null, false, { message: '가입되지 않은 회원입니다.' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });

        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  ));
};