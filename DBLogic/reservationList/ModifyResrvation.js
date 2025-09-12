//예약수정 api
const express = require('express');
const router = express.Router();
const db = require('../../DataBase/initdb.js');

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: 예약자 정보 수정
 *     description: 예약자의 정보를 수정합니다. ID는 고유해야 하며, 중복 시 수정되지 않습니다.
 *     tags:
 *       - Reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 기존 예약자 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *               - numberOfcremation
 *               - deadPersonName
 *             properties:
 *               name:
 *                 type: string
 *                 example: 홍길동
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-09-13 10:00:00
 *               numberOfcremation:
 *                 type: integer
 *                 example: 2
 *               deadPersonName:
 *                 type: string
 *                 example: 김철수
 *     responses:
 *       200:
 *         description: 예약자 정보 수정 성공
 *       400:
 *         description: 중복 또는 입력 오류
 *       404:
 *         description: 해당 예약자가 존재하지 않음
 *       500:
 *         description: 서버 오류
 */
router.put('/reservations/:id', (req, res) => {
  const { name, date, numberOfcremation, deadPersonName } = req.body;
  const id = req.params.id;

  if (!name || !date || !numberOfcremation || !deadPersonName) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }

  // 중복 검사: 동일한 날짜에 동일한 화장로 존재시
  const duplicateCheck = `
    SELECT * FROM reservationList WHERE date = ?  AND numberOfcremation = ?
  `;
  db.get(duplicateCheck, [date, numberOfcremation], (err, row) => {
    if (err) return res.status(500).json({ error: '중복 검사 실패' });
    if (row) return res.status(400).json({ error: '해당 시간은 이미 예약되었습니다..' });

    const updateQuery = `
      UPDATE reservationList
      SET name = ?, date = ?, numberOfcremation = ?, deadPersonName = ?
      WHERE id = ?
    `;
    db.run(updateQuery, [name, date, numberOfcremation, deadPersonName, id], function (err) {
      if (err) return res.status(500).json({ error: 'DB 수정 실패' });
      if (this.changes === 0) return res.status(404).json({ error: '예약자를 찾을 수 없습니다.' });

      res.status(200).json({ message: '예약자 정보 수정 완료' });
    });
  });
});

module.exports = router;