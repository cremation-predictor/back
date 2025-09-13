const db = require('../initdb.js');

function createReservationListTable() {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS reservationList (
        name CHAR(10),  --예약자 이름
        id VARCHAR(20) PRIMARY KEY,  --예약자 ID(입력받아 회원 구분용)
        facility VARCHAR(30),
        date DATETIME,  --YYYY-MM-DD HH:MM:SS 형식
        numberOfcremation INT,  --화장로 횟수
        deadPersonName VARCHAR(10) --고인 이름
      )`,
      (err) => {
        if (err) {
          console.error('❌ reservationList table creation failed:', err.message);
          return reject(err);
        }
        console.log('✅ reservationList table created.');
        resolve();
      }
    );
  });
}

module.exports = createReservationListTable;
