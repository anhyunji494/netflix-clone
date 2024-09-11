const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('비밀번호 해시 처리 중 오류 발생:', error);
    throw error;
  }
};

const comparePassword = async (password, hash) => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    console.error('비밀번호 비교 중 오류 발생:', error);
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
