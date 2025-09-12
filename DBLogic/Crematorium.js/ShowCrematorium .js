const express = require('express');
const router = express.Router();
const db = require('../../DataBase/initdb.js'); // SQLite 연결

// 시설 이름 기반 정보 조회 API
/**
 * @swagger
 * /facility/{name}:
 *   get:
 *     summary: 시설 이름으로 정보 조회
 *     description: 시설명을 기반으로 해당 시설의 상세 정보를 조회합니다.
 *     tags:
 *       - Facilities
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 시설명
 *         example: 서울시립승화원
 *     responses:
 *       200:
 *         description: 시설 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 province:
 *                   type: string
 *                   example: 서울특별시
 *                 district:
 *                   type: string
 *                   example: 서울특별시
 *                 facilityName:
 *                   type: string
 *                   example: 서울시립승화원
 *                 address:
 *                   type: string
 *                   example: 경기도 고양시 덕양구 통일로 504
 *                 phoneNumber:
 *                   type: string
 *                   example: 031-960-0236
 *                 website:
 *                   type: string
 *                   example: www.sisul.or.kr/memorial
 *                 parkingCapacity:
 *                   type: integer
 *                   example: 188
 *                 ownershipType:
 *                   type: string
 *                   example: 공설
 *                 cremationUnits:
 *                   type: integer
 *                   example: 23
 *                 hasRestaurant:
 *                   type: string
 *                   example: 설치
 *                 hasStore:
 *                   type: string
 *                   example: 설치
 *                 hasParkingLot:
 *                   type: string
 *                   example: 설치
 *                 hasWaitingRoom:
 *                   type: string
 *                   example: 설치
 *                 hasAccessibilityFacilities:
 *                   type: string
 *                   example: 설치
 *       404:
 *         description: 해당 시설을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 해당 시설을 찾을 수 없습니다.
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
router.get('/facility/:name', (req, res) => {
  const facilityName = req.params.name;

  const query = `SELECT * FROM facilities WHERE facilityName = ?`;
  db.get(query, [facilityName], (err, row) => {
    if (err) {
      console.error('❌ DB 조회 실패:', err.message);
      return res.status(500).json({ error: 'DB 조회 실패' });
    }

    if (!row) {
      return res.status(404).json({ message: '해당 시설을 찾을 수 없습니다.' });
    }

    res.json(row);
  });
});

module.exports = router;

