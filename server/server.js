const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db'); // db연결 가져오기

// 환경변수 로드
dotenv.config();

// Express app
const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Netflix Clone API' });
});

// moview, users 같은 다른 라우터 추가
// 데이터베이스를 사용하는 예제 라우트
app.get('/api/movies', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM movies');
    res.json(rows);
  } catch (error) {
    console.error('영화 목록 가져오기 오류:', error);
    res.status(500).json({ message: '서버 내부 오류' });
  }
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('오류가 발생했습니다.');
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`${PORT}에서 서버 실행중!`);
});
