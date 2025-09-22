# Cremation Predictor - Backend
화장 예측 시스템을 위한 백엔드 구성 프로젝트입니다.  
Node.js 기반의 백엔드 서버로, 화장장 예약 및 사망자 수 예측 기능, 고객 예약 및 확인 기능을 제공합니다.  
SQLite 데이터베이스와 CSV 파일을 함께 사용하며, Swagger를 통해 API 문서를 제공합니다.

---

## 프로젝트 구조
back/  
├── AI/                        # 머신러닝 모델 관련  
│   ├── modelApi.js  
│   └── model/  
├── DataBase/                  # DB 초기화 및 로직  
│   ├── createDB/  
│   │   ├── AdminUser.js  
│   │   ├── Crematorium.js  
│   │   ├── ReservationList.js  
│   │   ├── User.js  
│   │   ├── CreateDB.js  
│   │   └── initdb.js  
│   └── DBLogic/  
│       ├── adminUser/  
│       │   ├── Login.js  
│       │   ├── modifyAdmin.js  
│       │   ├── RegisterAdmin.js  
│       │   └── SignUp.js  
│       ├── crematorium/  
│       │   └── CheckCrematorium.js  
│       ├── reservationList/  
│       │   ├── CheckReservation.js  
│       │   ├── CreateReservation.js  
│       │   ├── ModifyReservation.js  
│       │   └── TakeReservation.js  
│       ├── commonFn/  
│       └── ShowCrematorium.js  
├── SettingFile/               # 설정 관련  
│   ├── .env  
│   ├── config.js  
│   ├── CorsConfig.js  
│   ├── Swagger.js  
│   ├── VScodeConfig.js  
│   └── Swagger.json  
├── app.js                     # 메인 서버 실행 파일  
├── Database.db                # SQLite DB 파일  
├── CrematoriumStatus.csv      # 화장장 상태 데이터 (CSV)  
├── package.json  
├── package-lock.json  
└── README.md

---

## 기술 스택
### 언어
- **Node.js (Express.js):** 메인 서버 프레임워크
- **Python 3.x:** 머신러닝 모델 실행 및 예측

### DB
- **SQLite3:** 경량 데이터베이스 (예약, 사용자, 관리자 정보 저장)
- **CSV 파일 (CrematoriumStatus.csv):** 화장장 상태 데이터 관리
- **scikit-learn:** 예측 모델 학습 및 추론

---

## 데이터베이스
본 프로젝트는 **SQLite3**를 주요 데이터베이스로 사용하며, 일부 데이터는 **CSV 파일(CrematoriumStatus.csv)**을 통해 관리합니다.  
`createDB.js`를 통해 서버 초기화 시 자동으로 테이블이 생성되고, 샘플 데이터가 삽입됩니다.

### 테이블 구조

#### 1. admin_user
- **설명:** 관리자 계정 정보를 저장합니다. ID는 기본 키이며, 비밀번호는 중복 불가입니다. 소속 시설명은 중복 가능하며, `Crematorium` 테이블과 연계해 정보를 조회합니다.
- **컬럼:**
  - **id (PK):** 관리자 ID
  - **password (NOT NULL):** 비밀번호
  - **facility:** 소속 시설명

#### 2. Crematorium
- **설명:** 전국 화장장 시설 정보를 저장합니다. 보건복지부 화장시설 CSV에서 자동 삽입됩니다. 기본 정보(주소, 연락처, 홈페이지 등)와 부대시설(식당, 매점, 주차장, 대기실, 장애인 편의시설 등)을 포함합니다.
- **컬럼:**
  - **facilityName (PK):** 시설명
  - **province (NOT NULL):** 시/도
  - **district (NOT NULL):** 시/군/구
  - **address (NOT NULL):** 주소
  - **phoneNumber (NOT NULL):** 전화번호
  - **website:** 홈페이지 주소
  - **parkingCapacity:** 주차 가능 대수
  - **ownershipType:** 공공/사설 구분
  - **cremationUnits:** 화장로 수
  - **hasRestaurant:** 식당 여부
  - **hasStore:** 매점 여부
  - **hasParkingLot:** 주차장 여부
  - **hasWaitingRoom:** 유족 대기실 여부
  - **hasAccessibilityFacilities:** 장애인 편의시설 여부

#### 3. reservationList
- **설명:** 예약 내역을 관리합니다. 예약자/고인 정보를 기록하여 관리자가 시설·시간·화장 횟수를 관리할 수 있도록 하며, 통계 및 예측 모델 데이터로 활용합니다.
- **컬럼:**
  - **id (PK):** 예약자 ID
  - **name:** 예약자 이름
  - **facility:** 예약 시설명
  - **date:** 예약 일시
  - **numberOfcremation:** 화장로 번호(또는 회차)
  - **deadPersonName:** 고인 이름

#### 4. user
- **설명:** 사용자 기본 정보를 저장합니다. 현재는 보조 테이블로, 공공기관 공유·추후 확장 대비용입니다.
- **컬럼:**
  - **name (PK):** 사용자 이름
  - **date:** 등록일

---

## API

### 1) Admin User API

#### 1. 관리자 로그인
**API 종류**  
GET

**설명**  
관리자 계정으로 로그인하여 JWT 토큰을 발급받습니다.  
- `id`, `password`를 쿼리 파라미터로 입력받아 DB에서 검증합니다.  
- 일치하는 계정이 있으면 토큰을 반환하며, 유효기간은 1시간입니다.

**요청 예시**
/login?id=admin01&password=pass123

코드

**응답 예시**
{ "message": "로그인 성공", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..." }

코드

#### 2. 관리자 정보 수정
**API 종류**  
PUT

**설명**  
관리자의 비밀번호와 소속 화장장이름을 수정합니다.  
- 다른 관리자의 ID와 동일한 비밀번호는 사용할 수 없습니다.  
- 해당 ID가 존재하지 않으면 수정할 수 없습니다.

**요청 예시**
{ "password": "newpassword123", "facility": "서울추모공원" }

코드

**응답 예시**
{ "message": "관리자 정보 수정 완료" }

코드

#### 3. 관리자 삭제
**API 종류**  
DELETE

**설명**  
관리자 계정을 삭제합니다.  
- ID와 비밀번호를 함께 입력받아 DB에서 일치하는 관리자가 존재하면 삭제합니다.

**요청 예시**
{ "id": "admin01", "password": "mypassword123" }

코드

**응답 예시**
{ "message": "삭제되었습니다. 그동안 이용해주셔서 감사합니다" }

코드

#### 4. 관리자 회원가입
**API 종류**  
POST

**설명**  
새로운 관리자 계정을 등록합니다.  
- 중복된 ID 또는 비밀번호는 허용되지 않습니다.

**요청 예시**
{ "id": "admin01", "password": "pass123" }

코드

**응답 예시**
{ "message": "관리자 등록이 완료되었습니다.", "id": "admin01" }

코드

---

### 2) Crematorium API

#### 1. 시설 정보 조회
**API 종류**  
GET

**설명**  
시설명을 기반으로 `Crematorium` 테이블에서 상세 정보를 조회합니다.  
- 쿼리 파라미터 `search`를 사용합니다.  
- `admin_user`의 `facility`로 조회에 활용할 수 있습니다.

**요청 예시**
/facility?search=서울시립승화원

코드

**응답 예시**
{ "province": "서울특별시", "district": "강남구", "facilityName": "서울시립승화원", "address": "서울시 강남구 ...", "phoneNumber": "02-123-4567", "cremationUnits": 10 }

코드

---

### 3) Reservation API

#### 1. 예약 등록
**API 종류**  
POST

**설명**  
새로운 화장장 예약을 등록합니다.  
- 예약자 ID 중복 여부 확인  
- 시설 존재 여부 확인  
- 시설의 화장로 수 초과 여부 확인  
- 동일 시간·화장로 중복 예약 여부 확인  
- 예약 등록 후 사용자 정보(`user` 테이블)도 함께 저장

**요청 예시**
{ "name": "홍길동", "id": "user123", "date": "2025-09-15T10:00:00", "numberOfcremation": 3, "deadPersonName": "김철수", "facility": "서울시립승화원" }

코드

**응답 예시**
{ "message": "예약이 등록되었습니다.", "id": "user123" }

코드

#### 2. 예약 확인
**API 종류**  
GET

**설명**  
특정 예약자의 예약 목록을 조회합니다.  
- 예약자 ID를 기반으로 예약 정보를 확인합니다.  
- 예약 내역이 없으면 빈 배열을 반환합니다.

**요청 예시**
/checkReservations/user123

코드

**응답 예시**
[ { "id": "user123", "name": "홍길동", "date": "2025-09-15", "numberOfcremation": 2, "deadPersonName": "김철수", "facility": "서울시립승화원" } ]

코드

#### 3. 예약 수정
**API 종류**  
PUT

**설명**  
예약자의 정보를 수정합니다.  
- 예약자 ID는 고유해야 합니다.  
- 존재하지 않는 ID일 경우 수정되지 않습니다.  
- 동일한 시간에 동일한 화장로가 이미 예약되어 있으면 수정할 수 없습니다.

**요청 예시**
{ "name": "홍길동", "date": "2025-09-13 10:00:00", "numberOfcremation": 2, "deadPersonName": "김철수" }

코드

**응답 예시**
{ "message": "예약자 정보 수정 완료" }

코드

#### 4. 예약 취소
**API 종류**  
DELETE

**설명**  
예약자의 예약 정보를 삭제합니다.  
- 예약자 ID와 이름을 함께 입력받아 일치하는 예약이 존재할 경우 삭제합니다.  
- 일치하는 예약이 없으면 삭제되지 않습니다.

**요청 예시**
{ "id": "user123", "name": "홍길동" }

코드

**응답 예시**
{ "message": "예약자 삭제 완료" }

코드

#### 5. 지난 예약 삭제
**API 종류**  
DELETE

**설명**  
현재 날짜 기준으로 이미 지난 예약들을 일괄 삭제합니다.  
- 예약 일자가 오늘보다 이전인 모든 예약을 삭제합니다.  
- 삭제된 예약의 개수를 반환합니다.

**요청 예시**
(별도의 요청 Body 필요 없음)

**응답 예시**
{ "message": "5개의 지난 예약이 삭제되었습니다." }

코드

---

## 현재 구현 상태
- **Admin User:** 로그인, 정보 수정, 삭제, 회원가입
- **Crematorium:** 시설 정보 조회
- **Reservation:** 예약 등록, 확인, 수정, 취소, 지난 예약 삭제
