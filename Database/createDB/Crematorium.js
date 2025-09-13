const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');

function createCrematoriumTable() {
  return new Promise((resolve, reject) => {
    const db = require('C:/moonlight_node/back/DataBase/initdb.js');

    db.run(
      `CREATE TABLE IF NOT EXISTS Crematorium (
        province TEXT NOT NULL,
        district TEXT NOT NULL,
        facilityName TEXT PRIMARY KEY,
        address TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        website TEXT,
        parkingCapacity INTEGER,
        ownershipType TEXT,
        cremationUnits INTEGER,
        hasRestaurant TEXT,
        hasStore TEXT,
        hasParkingLot TEXT,
        hasWaitingRoom TEXT,
        hasAccessibilityFacilities TEXT
      )`,
      (err) => {
        if (err) {
          console.error('❌ 테이블 생성 중 오류:', err.message);
          db.close();
          return reject(err);
        }

        console.log('✅ Crematorium 테이블 생성 완료 또는 이미 존재');

        fs.createReadStream('./CrematoriumStatus.csv')
          .pipe(
            csv({
              mapHeaders: ({ header }) =>
                header.trim().replace(/^\uFEFF/, ''),
            })
          )
          .on('data', (row) => {
            if (!row['시도']) {
              console.error('⚠️ 시도 값이 없습니다:', row);
              return;
            }
            db.run(
              `INSERT OR IGNORE INTO Crematorium (
                province, district, facilityName, address, phoneNumber,
                website, parkingCapacity, ownershipType, cremationUnits,
                hasRestaurant, hasStore, hasParkingLot, hasWaitingRoom, hasAccessibilityFacilities
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                row['시도'],
                row['시군구'],
                row['시설명'],
                row['주소'],
                row['전화번호'],
                row['홈페이지 주소'],
                parseInt(row['주차대수']) || 0,
                row['공-사설 구분'],
                parseInt(row['화장로수']) || 0,
                row['식당'],
                row['매점'],
                row['주차장'],
                row['유족대기실'],
                row['장애인편의시설'],
              ]
            );
          })
          .on('end', () => {
            console.log('✅ CSV 파일을 DB에 성공적으로 삽입했습니다.');
            
            resolve();
          })
          .on('error', (csvErr) => {
            console.error('❌ CSV 처리 중 오류:', csvErr.message);
            reject(csvErr);
          });
      }
    );
  });
}

module.exports = createCrematoriumTable;
