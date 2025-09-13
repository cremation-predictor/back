// 등록된 시간 지났을 시 삭제하는 API
const express = require('express');
const router = express.Router();
const db = require('../../DataBase/initdb'); // sqlite 연결

/**
 * @swagger
 * /clearReservations:
 *   delete:
 *     summary: 지난 예약 삭제
 *     description: >
 *       현재 날짜 기준으로 지난 예약들을 삭제합니다.  
 *       (기존 경로에 {id} 파라미터가 있었으나 로직에서 사용되지 않아 제거)
 *     tags:
 *       - Reservation
 *     responses:
 *       200:
 *         description: 지난 예약 삭제 성공
 *         content:
 *           application/json:
 *             example:
 *               message: "5개의 지난 예약이 삭제되었습니다."
 *       500:
 *         description: 서버 오류로 삭제 실패
 *         content:
 *           application/json:
 *             example:
 *               error: "지난 예약 삭제 API :: DB 삭제 실패"
 */
router.delete('/clearReservations', (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0]; // 현재 날짜 (YYYY-MM-DD 형식)

  const query = `DELETE FROM reservationList WHERE date < ?`;
  db.run(query, [currentDate], function (err) {
    if (err) {
      console.error('❌ 예약 삭제 실패:', err.message);
      return res.status(500).json({ error: '지난 예약 삭제 :: DB 삭제 실패' });
    }
    console.log(`✅ 예약 삭제 완료: ${this.changes}개의 예약이 삭제되었습니다.`);
    res.status(200).json({ message: `${this.changes}개의 지난 예약이 삭제되었습니다.` });
  });
});
//500 케이스 추가,id 피라미터 불필요로 삭제
module.exports = router;