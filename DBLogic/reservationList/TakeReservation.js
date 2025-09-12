//예약 등록 API
// 예약자 정보 검증 → ID 중복 확인 → 시설 화장로 수 확인 → 동일 시간·화장로 중복 예약 확인 → 예약 저장 및 사용자 정보(User) 등록
const db = require('../../DataBase/initdb.js'); 
const router = require('express').Router(); 

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: 화장장 예약 등록
 *     description: 
 *       새로운 화장장 예약을 등록합니다.  
 *       - 예약자 ID 중복 여부를 확인합니다.  
 *       - 시설의 화장로 수를 초과하는지 확인합니다.  
 *       - 동일 시간, 동일 화장로 번호 예약 중복 여부를 확인합니다.  
 *       - 예약 등록 후 사용자 정보(user 테이블)도 함께 저장합니다.
 *     tags:
 *       - Reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - id
 *               - date
 *               - numberOfcremation
 *               - deadPersonName
 *               - facility
 *             properties:
 *               name:
 *                 type: string
 *                 example: 홍길동
 *                 description: 예약자 이름
 *               id:
 *                 type: string
 *                 example: user123
 *                 description: 예약자 고유 ID
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-15T10:00:00"
 *                 description: 예약 일시 (ISO 8601 형식)
 *               numberOfcremation:
 *                 type: integer
 *                 example: 3
 *                 description: 예약할 화장로 번호
 *               deadPersonName:
 *                 type: string
 *                 example: 김철수
 *                 description: 고인의 이름
 *               facility:
 *                 type: string
 *                 example: 서울시립승화원
 *                 description: 예약할 시설명
 *     responses:
 *       201:
 *         description: 예약이 성공적으로 등록됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 예약이 등록되었습니다.
 *                 id:
 *                   type: string
 *                   example: user123
 *       400:
 *         description: 필수값 누락 또는 시설 화장로 수 초과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 모든 필드를 입력해주세요.
 *       404:
 *         description: 시설이 존재하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 해당 시설이 존재하지 않습니다.
 *       409:
 *         description: 예약자 ID 중복 또는 동일 시간 화장로 예약 중복
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 이미 등록된 예약자 ID입니다.
 *       500:
 *         description: 서버 내부 오류(DB 조회/삽입 실패 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: DB 조회 실패
 */

router.post('/reservations', (req, res) => {
  // 클라이언트로부터 전달받은 예약 정보 추출
  const { name, id, date, numberOfcremation, deadPersonName, facility } = req.body;

  // 필수값 누락 여부 확인
  if (!name || !id || !date || !numberOfcremation || !deadPersonName || !facility) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }

  // 1. 예약자 ID 중복 확인
  db.get(`SELECT id FROM reservationList WHERE id = ?`, [id], (err, existing) => {
    if (err) {
      console.error('❌ ID 중복 확인 실패:', err.message);
      return res.status(500).json({ error: 'DB 조회 실패' });
    }

    if (existing) {
      return res.status(409).json({ error: '이미 등록된 예약자 ID입니다.' });
    }

    // 2. 시설의 화장로 수 확인
    db.get(`SELECT cremationUnits FROM facilities WHERE facilityName = ?`, [facility], (err, facilityRow) => {
      if (err) {
        console.error('❌ 시설 정보 조회 실패:', err.message);
        return res.status(500).json({ error: '시설 정보 조회 실패' });
      }

      if (!facilityRow) {
        return res.status(404).json({ error: '해당 시설이 존재하지 않습니다.' });
      }

      const maxUnits = facilityRow.cremationUnits;
      if (numberOfcremation > maxUnits) {
        return res.status(400).json({ error: `해당 시설의 화장로 수(${maxUnits})를 초과할 수 없습니다.` });
      }

      // 3. 동일 시간에 동일 화장로 번호 예약 여부 확인
      const overlapQuery = `
        SELECT * FROM reservationList
        WHERE date = ? AND numberOfcremation = ? AND facility = ?
      `;
      db.get(overlapQuery, [date, numberOfcremation, facility], (err, overlap) => {
        if (err) {
          console.error('❌ 중복 예약 확인 실패:', err.message);
          return res.status(500).json({ error: '중복 예약 확인 실패' });
        }

        if (overlap) {
          return res.status(409).json({ error: '해당 시간에 이미 예약된 화장로 번호입니다.' });
        }

        // 4. 예약 정보 삽입
        const insertQuery = `
          INSERT INTO reservationList (name, id, facility, date, numberOfcremation, deadPersonName)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.run(insertQuery, [name, id, facility, date, numberOfcremation, deadPersonName], function (err) {
          if (err) {
            console.error('❌ 예약 삽입 실패:', err.message); 
            return res.status(500).json({ error: 'DB 삽입 실패' }); 
          }

          console.log(`¡¡예약 등록 완료: ${id}`); 

          // 예약 등록 후 사용자 정보 user 테이블에 추가
          const userQuery = `INSERT INTO user (name, id) VALUES (?, ?)`;
          db.run(userQuery, [name, id], function (userErr) {
            if (userErr) {
              console.error('❌ 사용자 삽입 실패:', userErr.message); // 사용자 삽입 실패 로그
              // 사용자 삽입 실패는 치명적이지 않으므로 에러 응답은 하지 않음
            } else {
              console.log(`¡¡사용자 등록 완료: ${id}`); // 사용자 등록 성공 로그
            }
          });

          res.status(201).json({ message: '예약이 등록되었습니다.', id }); 
        });
      });
    });
  });
});

module.exports = router; // 라우터 모듈 외부로 내보내기