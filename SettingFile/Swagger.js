const fs = require('fs');
const path = require('path');
const glob = require('glob');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// 📁 대상 경로 설정
const dbLogicFiles = glob.sync('./DBLogic/**/*.js', { absolute: true });
const modelApiFiles = glob.sync('C:/moonlight_node/back/AI/modelApi.js', { absolute: true });

// 📦 파일 병합 후 필터링
let files = [...dbLogicFiles, ...modelApiFiles];
files = files.filter(f => fs.existsSync(f) && fs.statSync(f).isFile());

// 🖨️ 확인용 로그
console.log('Swagger 대상 파일 목록:', files.map(f => path.basename(f)));

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'My API', version: '1.0.0' },
  },
  apis: files, // 실제 파일 경로만 전달
};

const specs = swaggerJsdoc(options);
module.exports = { swaggerUi, specs };
