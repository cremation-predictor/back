// 예약 수정 API
const express = require('express');
const router = express.Router();
const db = require('../../DataBase/initdb'); // sqlite 연결

/**
 * @swagger
 * /ModifyReservations/{id}:
 *   put:
 *     summary: 예약자 정보 수정
 *     description: >
 *       예약자의 정보를 수정합니다.  
 *       ID는 고유해야 하며, 존재하지 않거나 중복된 예약 시간일 경우 수정되지 않습니다.
 *     tags:
 *       - Reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 기존 예약자 ID
 *         schema:
 *           type: string
 *         example: resv001
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
 *                 description: 예약자 이름
 *                 example: 홍길동
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: 예약 일시 (YYYY-MM-DD HH:mm:ss)
 *                 example: "2025-09-13 10:00:00"
 *               numberOfcremation:
 *                 type: integer
 *                 description: 화장로 번호
 *                 example: 2
 *               deadPersonName:
 *                 type: string
 *                 description: 고인 이름
 *                 example: 김철수
 *     responses:
 *       200:
 *         description: 예약자 정보 수정 성공
 *         content:
 *           application/json:
 *             example:
 *               message: "예약자 정보 수정 완료"
 *       400:
 *         description: 잘못된 요청 (필드 누락 또는 예약 시간 중복)
 *         content:
 *           application/json:
 *             examples:
 *               missingFields:
 *                 value:
 *                   error: "예약 수정 API :: 모든 필드를 입력해주세요."
 *               duplicate:
 *                 value:
 *                   error: "예약 수정 API :: 해당 시간은 이미 예약되었습니다."
 *       404:
 *         description: 해당 예약자가 존재하지 않음
 *         content:
 *           application/json:
 *             example:
 *               error: "예약 수정 API :: 예약자를 찾을 수 없습니다."
 *       409:
 *         description: 없는 예약자 ID
 *         content:
 *           application/json:
 *             example:
 *               error: "예약 수정 API :: 없는 예약자 ID입니다."
 *       500:
 *         description: 서버 오류 (DB 조회/수정 실패)
 *         content:
 *           application/json:
 *             examples:
 *               idCheckFail:
 *                 value:
 *                   error: "예약 수정 API :: 조회 실패"
 *               duplicateCheckFail:
 *                 value:
 *                   error: "예약 수정 API :: 중복 검사 실패"
 *               updateFail:
 *                 value:
 *                   error: "예약 수정 API :: DB 수정 실패"
 */
router.put('/ModifyReservations/:id', (req, res) => {
  const { name, date, numberOfcremation, deadPersonName } = req.body;
  const id = req.params.id;

  if (!name || !date || !numberOfcremation || !deadPersonName) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }

  // 아이디 확인
  db.get(`SELECT id FROM reservationList WHERE id = ?`, [id], (err, existing) => {
    if (err) {
      console.error('❌ ID 중복 확인 실패:', err.message);
      return res.status(500).json({ error: '예약 수정 API :: 조회 실패' });
    }

    if (!existing) {
      return res.status(409).json({ error: ' 없는 예약자 ID입니다.' });
    }

    // 중복 검사: 동일한 날짜에 동일한 화장로 존재 시
    const duplicateCheck = `
      SELECT * FROM reservationList WHERE date = ? AND numberOfcremation = ?
    `;
    db.get(duplicateCheck, [date, numberOfcremation], (err, row) => {
      if (err) {
        return res.status(500).json({ error: '예약 수정 API :: 중복 검사 실패' });
      }
      if (row) {
        return res.status(400).json({ error: '해당 시간은 이미 예약되었습니다.' });
      }

      const updateQuery = `
        UPDATE reservationList
        SET name = ?, date = ?, numberOfcremation = ?, deadPersonName = ?
        WHERE id = ?
      `;
      db.run(updateQuery, [name, date, numberOfcremation, deadPersonName, id], function (err) {
        if (err) {
          return res.status(500).json({ error: '예약 수정 :: DB 수정 실패' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: '예약자를 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '예약자 정보 수정 완료' });
      });
    });
  });
});

//500 응답 세분화 (조회 실패, 중복 검사 실패, DB 수정 실패)
module.exports = router;