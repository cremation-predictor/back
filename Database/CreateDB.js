const createAdminUserTable = require('./createDB/AdminUser');
const createReservationListTable = require('./createDB/ReservationList');
const createUserTable = require('./createDB/User');
const createCrematoriumTable = require('./createDB/Crematorium');

const db = require('./initdb');

const setSample = require('../sample/SetSample');
async function createDB() {
  
  await createReservationListTable();
  await createUserTable();
  await createCrematoriumTable();
  await createAdminUserTable();
  await setSample();
 
  }

module.exports = createDB;
