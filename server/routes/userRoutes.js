const express = require('express');
const router = express.Router();
const { hashPassword } = require('./passwordUtils');
const db = require('./db');

// 가입
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const [result] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: '사용자가 성공적으로 등록되었습니다.',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('사용자 등록 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

//로그인

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const user = users[0];
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // 여기에 로그인 성공 후의 로직을 추가합니다 (예: JWT 토큰 생성)
    res.json({ message: '로그인 성공', userId: user.id });
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
