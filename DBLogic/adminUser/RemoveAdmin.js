// 관리자 삭제 API
const db = require('../../DataBase/initdb'); // sqlite 연결

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: 관리자 삭제
 *     description: 주어진 ID에 해당하는 관리자를 삭제합니다.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 삭제할 관리자 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 관리자 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 관리자 삭제 성공
 *       404:
 *         description: 해당 ID의 관리자가 존재하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 해당 ID의 관리자가 존재하지 않습니다
 *       500:
 *         description: 서버 오류로 삭제 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 오류로 삭제 실패
 */

router.delete('/admin/:id', (req, res) => {
  const adminId = req.params.id;

  const query = `DELETE FROM admin_user WHERE id = ? AND password = ?`;

  db.run(query, [adminId], function (err) {
    if (err) {
      console.error('❌ 관리자 삭제 실패:', err.message);
      return res.status(500).json({ message: '서버 오류로 삭제 실패' });
    }

    if (this.changes === 0) {
      // 삭제된 행이 없을 경우
      return res.status(404).json({ message: '해당 ID의 관리자가 존재하지 않습니다' });
    }

    console.log(`✅ 관리자 ${adminId} 삭제 완료`);
    res.status(200).json({ message: '관리자 삭제 성공' });
  });
});

module.exports = router;