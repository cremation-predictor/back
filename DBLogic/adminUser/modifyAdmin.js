const express = require('express');
const router = express.Router();
const db = require('../../DataBase/initdb'); // sqlite 연결

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: 관리자 정보 수정
 *     description: 관리자 비밀번호와 화장장이름을 수정합니다. 다른 관리자의 ID와 동일한 비밀번호는 사용할 수 없습니다.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 수정할 관리자 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - facility
 *             properties:
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               facility:
 *                 type: string
 *                 example: 서울추모공원
 *     responses:
 *       200:
 *         description: 관리자 정보 수정 성공
 *       400:
 *         description: 중복된 비밀번호 또는 입력 오류
 *       404:
 *         description: 해당 ID의 관리자가 존재하지 않음
 *       500:
 *         description: 서버 오류
 */

router.put('/admin/:id', (req, res) => {
  const adminId = req.params.id;
  const { password, facility } = req.body;

  if (!id || !password || !facility) {
    return res.status(400).json({ message: ' 모든 정보를 입력해주세요.' });
  }

  // 중복 검사: 다른 관리자의 ID와 동일한 비밀번호가 존재하는지 확인
  const duplicateCheckQuery = `
    SELECT * FROM admin_user WHERE id != ? AND password = ?
  `;
  db.get(duplicateCheckQuery, [adminId, password], (err, row) => {
    if (err) {
      console.error('❌ 중복 검사 실패:', err.message);
      return res.status(500).json({ message: '서버 오류로 중복 검사 실패' });
    }

    if (row) {
      return res.status(400).json({ message: '이미 ID혹은 password를 사용중입니다.' });
    }

    // 중복이 없으면 수정 진행
    const updateQuery = `UPDATE admin_user SET password = ?, facility = ? WHERE id = ?`;

    db.run(updateQuery, [password, facility, adminId], function (err) {
      if (err) {
        console.error('❌ 관리자 정보 수정 실패:', err.message);
        return res.status(500).json({ message: '서버 오류로 수정 실패' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: '해당 ID의 관리자가 존재하지 않습니다' });
      }

      console.log(`✅ 관리자 ${adminId} 정보 수정 완료`);
      res.status(200).json({ message: '관리자 정보 수정 완료' });
    });
  });
});

module.exports = router;
