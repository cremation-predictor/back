// 관리자 삭제 API
// id, 비밀번호를 함께 입력받아 DB에서 일치하는 관리자가 존재하면 삭제
const express = require('express');
const db = require('../../DataBase/initdb'); // sqlite 연결
const router = express.Router();

/**
 * @swagger
 * /admin:
 *   delete:
 *     summary: 관리자 삭제 (ID와 비밀번호 확인)
 *     description: ID와 비밀번호를 함께 입력받아, DB에서 일치하는 관리자가 존재하면 삭제합니다.
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
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: 관리자 삭제 성공
 *         content:
 *           application/json:
 *             example:
 *               message: "삭제되었습니다. 그동안 이용해주셔서 감사합니다"
 *       400:
 *         description: ID 또는 비밀번호 누락
 *         content:
 *           application/json:
 *             example:
 *               error: "관리자 삭제 API :: ID와 비밀번호를 모두 입력해주세요."
 *       401:
 *         description: ID 또는 비밀번호 불일치
 *         content:
 *           application/json:
 *             example:
 *               error: "관리자 삭제 API :: ID 또는 비밀번호가 올바르지 않습니다."
 *       500:
 *         description: 서버 오류로 삭제 실패
 *         content:
 *           application/json:
 *             examples:
 *               checkFail:
 *                 value:
 *                   error: "관리자 삭제 API :: 서버 오류로 관리자 확인 실패"
 *               deleteFail:
 *                 value:
 *                   error: "관리자 삭제 API :: 서버 오류로 삭제 실패"
 */
router.delete('/admin', (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ error: 'ID와 비밀번호를 모두 입력해주세요.' });
  }

  // ID와 비밀번호가 모두 일치하는 관리자 확인
  db.get(`SELECT id FROM admin_user WHERE id = ? AND password = ?`, [id, password], (err, row) => {
    if (err) {
      console.error('❌ 관리자 확인 실패:', err.message);
      return res.status(500).json({ error: ' 서버 오류로 관리자 확인 실패' });
    }

    if (!row) {
      return res.status(401).json({ error: ' ID 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 삭제 실행
    db.run(`DELETE FROM admin_user WHERE id = ?`, [id], function (err) {
      if (err) {
        console.error('❌ 관리자 삭제 실패:', err.message);
        return res.status(500).json({ error: ' 서버 오류로 삭제 실패' });
      }

      res.status(200).json({ message: '삭제되었습니다. 그동안 이용해주셔서 감사합니다' });
    });
  });
});

module.exports = router;
