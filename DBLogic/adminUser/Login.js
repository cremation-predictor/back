// Database/DBLogic/adminUser/Login.js
// 관리자 로그인 API

// 환경변수는 SettingFile/config.js에서 한 번만 로드해 전역 공유
// 각 라우터는 config에서 가져와 로딩 순서·속도 문제를 방지
const { SECRET_KEY } = require('../../SettingFile/config');

// 라우터 연결
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const db = require('../../DataBase/initdb.js');

// 로그인 API, id·pw 쿼리로 입력 받아서 DB와 비교
/**
 * @swagger
 * /login:
 *   get:
 *     summary: 관리자 로그인
 *     description: 쿼리 파라미터로 id와 password를 받아 로그인 처리 후 JWT 토큰을 반환합니다.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 관리자 아이디
 *         example: admin01
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         description: 관리자 비밀번호
 *         example: pass123
 *     responses:
 *       200:
 *         description: 로그인 성공 및 토큰 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그인 성공
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: 로그인 실패 (아이디 또는 비밀번호 오류)
 *         content:
 *           application/json:
 *             example:
 *               error: "관리자 로그인 API :: 아이디 또는 비밀번호가 올바르지 않습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             example:
 *               error: "관리자 로그인 API :: DB 조회 실패"
 */
router.get('/login', (req, res) => {
  const { id, password } = req.query;

  db.all(`SELECT * FROM admin_user`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '관리자 로그인 :: DB 조회 실패' });
    }

    const matched = rows.find(
      (admin) => admin.id === id && admin.password === password
    );

    if (matched) {
      const token = jwt.sign(
        { id: matched.id, role: 'admin' },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      res.json({ message: '로그인 성공', token });
    } else {
      res
        .status(401)
        .json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
  });
});

module.exports = router;