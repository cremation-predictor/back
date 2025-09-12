//예약 취소 api
const express = require('express');
const router = express.Router();
const db = require('../../DataBase/initdb'); // sqlite 연결

/**
 * @swagger
 * /reservations:
 *   delete:
 *     summary: 예약자 삭제
 *     description: 예약자 ID와 이름을 기준으로 예약 정보를 삭제합니다.
 *     tags:
 *       - Reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: string
 *                 example: user123
 *               name:
 *                 type: string
 *                 example: 홍길동
 *     responses:
 *       200:
 *         description: 예약자 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 예약자 삭제 완료
 *       404:
 *         description: 해당 예약자가 존재하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 예약자를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: DB 삭제 실패
 */

router.delete('/reservations', (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: 'ID와 이름을 모두 입력해주세요.' });
  }

  const query = `DELETE FROM reservationList WHERE id = ? AND name = ?`;

  db.run(query, [id, name], function (err) {
    if (err) {
      console.error('❌ 예약자 삭제 실패:', err.message);
      return res.status(500).json({ error: 'DB 삭제 실패' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: '예약자를 찾을 수 없습니다.' });
    }

    console.log(`✅ 예약자 삭제 완료: ${id}, ${name}`);
    res.status(200).json({ message: '예약자 삭제 완료' });
  });
});

module.exports = router;
