// backend/controllers/user.js
const bcrypt = require('bcrypt');
const { User } = require('../models');

/**
 * [GET] /api/user/me
 *   - 내 정보 조회
 */
exports.getMyInfo = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
    }
    const me = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['pw', 'refresh_token'] },
    });
    if (!me) {
      return res.status(404).json({ success: false, message: '유저를 찾을 수 없습니다.' });
    }
    res.json({ success: true, user: me });
  } catch (err) {
    next(err);
  }
};

/**
 * [PUT] /api/user/me
 * Body: { name, emailNotification, currentPassword }
 *   - 내 정보 업데이트
 */
exports.updateMyInfo = async (req, res, next) => {
  const { name, emailNotification, currentPassword } = req.body;
  if (!currentPassword) {
    return res.status(400).json({ message: '현재 비밀번호를 입력해주세요.' });
  }
  const nameRegex = /^[가-힣a-zA-Z ]{2,10}$/;
  if (name && !nameRegex.test(name)) {
    return res.status(400).json({ message: '이름은 2~10자 한글 또는 영문만 가능합니다.' });
  }
  try {
    const user = await User.scope('withPassword').findByPk(req.user.user_id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }


    await User.update(
      {
        ...(name && { name }),
        email_notification: emailNotification === undefined ? user.emailNotification : emailNotification
      },
      { where: { user_id: req.user.user_id } }
    );
    res.json({ success: true, message: '회원 정보가 수정되었습니다.' });
  } catch (err) {
    next(err);
  }
};

/**
 * [PUT] /api/user/me/password
 * Body: { currentPassword, newPassword }
 *   - 비밀번호 변경
 */
exports.changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }
  try {
    const user = await User.scope('withPassword').findByPk(req.user.user_id);
    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: '비밀번호가 변경되었습니다.' });
  } catch (err) {
    next(err);
  }
};

/**
 * [DELETE] /api/user/me
 *   - 계정 탈퇴(soft-delete)
 */
exports.deactivateAccount = async (req, res, next) => {
  try {
    await User.update(
      { state_code: 'inactive'},
      { where: { user_id: req.user.user_id } }
    );
    req.logout(() => {}); // 세션 종료
    res.json({ success: true, message: '계정이 비활성화되었습니다.' });
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async(req, res, next)  => {
  try {
    await User.destroy({
      where: {user_id: req.user.user_id}
    });
    res.json({success: true, message: '계정이 삭제되었습니다.'});
  } catch (err) {
    next(err);
  }
}
