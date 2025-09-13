const express = require('express');
const router = express.Router();
const db = require('../../DataBase/initdb');

// 테이블 조회 API
// - 허용된 테이블만 조회 가능
// - 잘못된 테이블명 요청 시 400 반환
// - DB 조회 실패 시 500 반환

/**
 * @swagger
 * /table/{tableName}:
 *   get:
 *     summary: 지정한 테이블의 모든 데이터 조회
 *     description: URL 경로 파라미터로 전달된 테이블 이름의 모든 행을 반환합니다. 허용된 테이블만 조회할 수 있습니다.
 *     tags:
 *       - default
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 테이블 이름
 *         example: admin_user
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties: true
 *             example:
 *               - id: "admin01"
 *                 password: "pass123"
 *                 facility: "Seoul Crematory"
 *               - id: "admin02"
 *                 password: "secure456"
 *                 facility: "Busan Memorial"
 *       400:
 *         description: 잘못된 요청 (허용되지 않은 테이블명)
 *         content:
 *           application/json:
 *             example:
 *               error: "테이블 조회 API :: 허용되지 않은 테이블입니다."
 *       500:
 *         description: 서버 오류 (DB 조회 실패)
 *         content:
 *           application/json:
 *             example:
 *               error: "테이블 조회 API :: DB 조회 중 오류 발생"
 */
router.get('/table/:tableName', (req, res) => {
  const { tableName } = req.params;

  // 허용된 테이블 목록
  const allowedTables = ['admin_user', 'reservationList', 'user', 'Crematorium'];

  if (!allowedTables.includes(tableName)) {
    return res.status(400).json({ error: '허용되지 않은 테이블입니다.' });
  }

  db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
    if (err) {
      console.error(`❌ ${tableName} 조회 실패:`, err.message);
      return res.status(500).json({ error: '테이블 조회 :: DB 조회 중 오류 발생' });
    }
    res.status(200).json(rows);
  });
});

module.exports = router;
