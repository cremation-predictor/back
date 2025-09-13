const db = require('../initdb');

function createAdminUserTable() {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS admin_user (
        id VARCHAR(20) PRIMARY KEY,
        password VARCHAR(20) NOT NULL,
        facility VARCHAR(30)
      )`,
      (err) => {
        if (err) {
          console.error('❌ admin_user table creation failed:', err.message);
          return reject(err);
        }
        console.log('✅ admin_user table created.');
        resolve();
      }
    );
  });
}

module.exports = createAdminUserTable;
