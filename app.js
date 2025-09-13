const express = require('express');
const app = express();
const db = require('./DataBase/initdb');

//swagger요청 확인용
// app.use((req, res, next) => {
//   console.log("➡️ 요청 들어옴:", req.method, req.url);
//   next();
// });

const corsMiddleware = require('./SettingFile/CorsConfig');
const { PORT } = require('./SettingFile/config');

const fs = require('fs');
const path = require('path');
const os = require('os');

const CreateDB = require("./DataBase/createDB")



// Swagger 연결
const { swaggerUi, specs } = require('./SettingFile/Swagger');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// CORS 설정
app.use(corsMiddleware);
app.use(express.json());

console.log('   corsMiddleware 타입:', typeof corsMiddleware);

//라우터 자동 로딩 함수
function loadRoutesFromDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      loadRoutesFromDir(fullPath);
    } else if (file.endsWith('.js')) {
      const route = require(fullPath);
      app.use('/', route);
      console.log(`✅ 라우터 등록: ${fullPath}`);
    }
    
  });
 
}


//서버 IP 출력 함수
function printServerIPs() {
  const networkInterfaces = os.networkInterfaces();
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`✅ 서버 IP 주소: http://${net.address}:${PORT}`);
      }
    }
  }
}

// 초기화 함수
async function initApp() {
  console.log('서버 초기화 시작');

  // 1. DB 초기화가 필요하다면 여기서 await
  await CreateDB();
  
  

  // 2. 라우터 등록
  loadRoutesFromDir(path.join(__dirname, 'DBLogic'));
  

  // 3. 서버 IP 출력
  printServerIPs();

  console.log('✅ 초기화 완료');
}

// 초기화 후 서버 시작
initApp()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ 서버 초기화 실패:', err);
    
  });
