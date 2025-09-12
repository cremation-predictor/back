// DBLogic/commonFun/showList.js
const db = require('../../DataBase/initdb.js');

// 허용된 테이블 목록 (보안상 필수)
const allowedTables = ['admin_user', 'reservationList', 'user'];

function showList(tableName, res) {
  // 테이블 이름 검증
  if (!allowedTables.includes(tableName)) {
    return res.status(400).json({ error: '허용되지 않은 테이블입니다.' });
  }

  // 데이터 조회
  db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
    if (err) {
      console.error(`❌ ${tableName} 테이블 조회 실패:`, err.message);
      return res.status(500).json({ error: `${tableName} 테이블 출력 실패` });
    }
    console.log(`✅ ${tableName} 테이블 조회 성공`);
    res.json(rows);
  });
}

module.exports = showList;