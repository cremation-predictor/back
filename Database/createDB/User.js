const db = require('../initdb.js');

function createUserTable() {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS user (
        name VARCHAR(10) PRIMARY KEY, --사용자 이름
        date DATE --사용자 등록일
      )`,
      (err) => {
        if (err) {
          console.error('❌ user table creation failed:', err.message);
           db.close();
          return reject(err);
        }
        console.log('✅ user table created.');
        resolve();
      }
    );
  });
}

module.exports = createUserTable;
