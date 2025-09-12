//예약 확인 api
const db = require('../../DataBase/initdb.js'); // sqlite 연결

// 라우터 연결
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /checkReservations/{id}:
 *   get:
 *     summary: 특정 예약자의 예약 목록 조회
 *     description: 예약자 ID를 기반으로 예약 정보를 조회합니다.
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 예약자 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 예약자 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 해당 ID의 예약자가 없습니다.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       time:
 *                         type: string
 *       500:
 *         description: DB 조회 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: DB 조회 실패
 */

// 예약자 목록 조회
router.get('/checkReservations/:id', (req, res) => {
    const requesterId = req.params.id; // 브라우저에서 요청자 정보(예약자) id받기

    const query = `SELECT * FROM reservationList WHERE id = ?`;
    db.all(query, [requesterId], (err, rows) => {
        if (err) { // 에러 처리
            console.error('❌ 예약자 조회 실패:', err.message);
            return res.status(500).json({ error: 'DB 조회 실패' });
        }
        if (rows.length === 0) { // 해당 id의 예약자가 없을 때
            return res.status(200).json({ message: '해당 ID의 예약자가 없습니다.', data: [] });
        }
        console.log(`¡¡예약자 조회 완료: ${requesterId}`);
        res.json(rows); // 예약자 정보 반환
    });
});

module.exports = router;