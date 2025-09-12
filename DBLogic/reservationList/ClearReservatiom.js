//등록된 시간 지났을시 삭제하는 qpi

const db = require('../../DataBase/initdb'); // sqlite 연결

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /clearReservations/{id}:
 *   delete:
 *     summary: 지난 예약 삭제
 *     description: 현재 날짜 기준으로 지난 예약들을 삭제합니다. ID는 예약자 식별용이지만 현재 로직에서는 사용되지 않습니다.
 *     tags:
 *       - Reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 예약자 ID (현재는 로직에 사용되지 않음)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 지난 예약 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 5개의 지난 예약이 삭제되었습니다.
 *       500:
 *         description: 서버 오류로 삭제 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: DB 삭제 실패
 */

router.delete('/clearReservations/:id', (req, res) => {
    const currentDate = new Date().toISOString().split('T')[0]; // 현재 날짜 (YYYY-MM-DD 형식)

    const query = `DELETE FROM reservationList WHERE date < ?`;
    db.run(query, [currentDate], function (err) {
        if (err) {
            console.error('❌ 예약 삭제 실패:', err.message);
            return res.status(500).json({ error: 'DB 삭제 실패' });
        }
        console.log(`✅ 예약 삭제 완료: ${this.changes}개의 예약이 삭제되었습니다.`);
        res.json({ message: `${this.changes}개의 지난 예약이 삭제되었습니다.` });
    });
});

module.exports = router;
