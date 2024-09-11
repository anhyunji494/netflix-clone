const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function updatePasswords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'netflix_clone',
  });

  try {
    // 모든 사용자 가져오기
    const [users] = await connection.query('SELECT id, password FROM users');

    for (const user of users) {
      // 각 비밀번호 해시 처리
      const hashedPassword = await hashPassword(user.password);

      // 해시된 비밀번호로 업데이트
      await connection.query('UPDATE users SET password = ? WHERE id = ?', [
        hashedPassword,
        user.id,
      ]);
    }

    console.log('모든 비밀번호가 해시 처리되었습니다.');
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await connection.end();
  }
}

updatePasswords();
