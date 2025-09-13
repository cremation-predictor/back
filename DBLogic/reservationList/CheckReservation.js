// 예약 확인 API
const express = require('express');
const router = express.Router();
const db = require('../../DataBase/initdb'); // sqlite 연결

/**
 * @swagger
 * /checkReservations/{id}:
 *   get:
 *     summary: 특정 예약자의 예약 목록 조회
 *     description: 예약자 ID를 기반으로 예약 정보를 조회합니다.
 *     tags:
 *       - Reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 예약자 ID
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: 예약자 정보 조회 성공
 *         content:
 *           application/json:
 *             examples:
 *               noReservations:
 *                 value:
 *                   message: "해당 ID의 예약자가 없습니다."
 *                   data: []
 *               hasReservations:
 *                 value:
 *                   - id: "user123"
 *                     name: "홍길동"
 *                     date: "2025-09-15"
 *                     numberOfcremation: 2
 *                     deadPersonName: "김철수"
 *       400:
 *         description: 필수값 누락
 *         content:
 *           application/json:
 *             example:
 *               error: "예약 확인 API :: ID를 입력해주세요."
 *       500:
 *         description: DB 조회 실패
 *         content:
 *           application/json:
 *             example:
 *               error: "예약 확인 API :: DB 조회 실패"
 */
router.get('/checkReservations/:id', (req, res) => {
  const requesterId = req.params.id; // 브라우저에서 요청자 정보(예약자) id 받기

  if (!requesterId) {
    return res.status(400).json({ error: 'ID를 입력해주세요.' });
  }

  const query = `SELECT * FROM reservationList WHERE id = ?`;
  db.all(query, [requesterId], (err, rows) => {
    if (err) {
      console.error('❌ 예약자 조회 실패:', err.message);
      return res.status(500).json({ error: '예약 확인 :: DB 조회 실패' });
    }

    if (rows.length === 0) {
      return res.status(200).json({ message: '해당 ID의 예약자가 없습니다.', data: [] });
    }

    console.log(`✅ 예약자 조회 완료: ${requesterId}`);
    res.status(200).json(rows);
  });
});
//400케이스 추가
module.exports = router;