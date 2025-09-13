// SettingFile/config.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('[config.js] SECRET_KEY:', process.env.SECRET_KEY);
console.log('[config.js] PORT:', process.env.PORT);

if (!process.env.SECRET_KEY) {
  throw new Error('❌ SECRET_KEY 환경변수가 설정되지 않았습니다.');
}

module.exports = {
  SECRET_KEY: process.env.SECRET_KEY,
  PORT: process.env.PORT || 3000
};
