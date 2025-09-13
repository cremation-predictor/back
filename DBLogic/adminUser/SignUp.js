const express = require('express'); // express 모듈 가져오기
const db = require('../../DataBase/initdb.js'); // sqlite 연결

const router = express.Router();
router.use(express.json()); // JSON 요청 자동 파싱

// 관리자 회원가입 API
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: 관리자 회원가입
 *     description: >
 *       새로운 관리자 계정을 등록합니다.  
 *       중복된 ID 또는 비밀번호는 허용되지 않습니다.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *                 example: admin01
 *                 description: 관리자 ID
 *               password:
 *                 type: string
 *                 example: pass123
 *                 description: 관리자 비밀번호
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             example:
 *               message: "관리자 등록이 완료되었습니다."
 *               id: "admin01"
 *       409:
 *         description: 중복된 아이디 또는 비밀번호
 *         content:
 *           application/json:
 *             examples:
 *               duplicateId:
 *                 value:
 *                   error: "관리자 회원가입 API :: 이미 존재하는 아이디입니다."
 *               duplicatePassword:
 *                 value:
 *                   error: "관리자 회원가입 API :: 이미 존재하는 비밀번호입니다."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             examples:
 *               selectFail:
 *                 value:
 *                   error: "관리자 회원가입 API :: DB 조회 실패"
 *               insertFail:
 *                 value:
 *                   error: "관리자 회원가입 API :: DB 삽입 실패"
 */
router.post('/signup', (req, res) => {
  const newAdmin = req.body; // 브라우저에서 요청자 정보(id, password) 받기

  db.all(`SELECT * FROM admin_user`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '관리자 회원가입 API :: DB 조회 실패' });
    }

    // 중복 ID 확인
    let duplicate = rows.find((admin) => admin.id === newAdmin.id);
    if (duplicate) {
      return res.status(409).json({ error: '이미 존재하는 아이디입니다.' });
    }

    // 중복 PW 확인
    duplicate = rows.find((admin) => admin.password === newAdmin.password);
    if (duplicate) {
      return res.status(409).json({ error: '이미 존재하는 비밀번호입니다.' });
    }

    // 중복 없으니 admin_user 테이블에 삽입
    const query = `INSERT INTO admin_user (id, password) VALUES (?, ?)`;
    db.run(query, [newAdmin.id, newAdmin.password], function (err) {
      if (err) {
        console.error('❌ 관리자 삽입 실패:', err.message);
        return res.status(500).json({ error: '관리자 회원가입 :: DB 삽입 실패' });
      }
      console.log(`✅ 관리자 등록 완료: ${newAdmin.id}`);
      res.status(201).json({ message: '관리자 등록이 완료되었습니다.', id: newAdmin.id });
    });
  });
});

module.exports = router;
