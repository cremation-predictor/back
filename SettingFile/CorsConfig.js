//	CORS 정책문제 : 브라우저 정책 문제,다른 도메인에서 요청할때 cors헤더 안주면 브라우저가 응답 차단
//따라서 별도 파일로 cors해더 전달, 서버실행 파일에 필수적으로 포함 필요함
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-frontend.com'], //프론트 형성 후 주소 정할것
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

module.exports = cors(corsOptions);

