// Database/DBLogic/adminUser/Login.js
console.log('✅ Login.js 라우터 로딩 시작');

//라우터 연결
const express = require('express');
const router = express.Router();


require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../../DataBase/initdb.js');

const SECRET_KEY = process.env.SECRET_KEY;

//로그인 api, id.pw 쿼리로 입력 받아서 db와 비교
/**
 * @openapi
 * /login:
 *   get:
 *     summary: 관리자 로그인
 *     description: 쿼리 파라미터로 id와 password를 받아 로그인 처리 후 JWT 토큰 반환
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 관리자 아이디
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         description: 관리자 비밀번호
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
 *                 token:
 *                   type: string
 *       401:
 *         description: 로그인 실패 (아이디 또는 비밀번호 오류)
 *       500:
 *         description: 서버 오류
 */
router.get('/login', (req, res) => {
  const { id, password } = req.query;

  db.all(`SELECT * FROM admin_user`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const matched = rows.find(admin => admin.id === id && admin.password === password);

    if (matched) {
      const token = jwt.sign(
        { id: matched.id, role: 'admin' },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      res.json({ message: '로그인 성공', token });
    } else {
      res.status(401).json({ error: '로그인 실패: 아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
  });
});

console.log('✅ Login.js 라우터 준비 완료');
module.exports = router;