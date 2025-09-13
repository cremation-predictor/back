const express = require('express');
const router = express.Router();
const db = require('../../DataBase/initdb'); // sqlite 연결

// 시설이름 기반 조회 API
/**
 * @swagger
 * /facility:
 *   get:
 *     summary: 화장터 이름으로 정보 조회
 *     description: >
 *       쿼리 파라미터 `search`를 사용해 Crematorium 테이블에서 해당 시설의 상세 정보를 조회합니다.
 *     tags:
 *       - Crematorium
 *     parameters:
 *       - in: query
 *         name: search
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
 *             example:
 *               province: "서울특별시"
 *               district: "강남구"
 *               facilityName: "서울시립승화원"
 *               address: "서울시 강남구 ..."
 *               phoneNumber: "02-123-4567"
 *               cremationUnits: 10
 *       400:
 *         description: 검색어 누락
 *         content:
 *           application/json:
 *             example:
 *               error: "시설 조회 API :: 검색어를 입력해주세요."
 *       404:
 *         description: 해당 시설을 찾을 수 없음
 *         content:
 *           application/json:
 *             example:
 *               error: "시설 조회 API :: 해당 시설을 찾을 수 없습니다."
 *       500:
 *         description: DB 조회 실패
 *         content:
 *           application/json:
 *             example:
 *               error: "시설 조회 API :: DB 조회 실패"
 */
router.get('/facility', (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ error: '검색어를 입력해주세요.' });
  }

  const query = `SELECT * FROM Crematorium WHERE facilityName = ?;`;
  db.get(query, [search], (err, row) => {
    if (err) {
      console.error('❌ DB 조회 실패:', err.message);
      return res.status(500).json({ error: '시설 조회 :: DB 조회 실패' });
    }

    if (!row) {
      return res.status(404).json({ error: '해당 시설을 찾을 수 없습니다.' });
    }

    res.status(200).json(row);
  });
});

module.exports = router;
