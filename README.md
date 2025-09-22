# Cremation Predictor - Backend
이 프로젝트는 화장장 예약 관리와 사망자 수 예측을 지원하는 백엔드 시스템입니다.  
Node.js 기반으로 구축되었으며, SQLite 데이터베이스와 CSV 데이터를 활용해 안정적인 예약 관리와 통계 분석을 제공합니다.
또한 Swagger를 통해 직관적인 API 문서를 제공하여 개발자와 사용자 모두 쉽게 접근할 수 있습니다.

---

## 프로젝트 구조
back/  
├── AI/  
│   ├── modelApi.js  
│   └── model/  
├── DataBase/  
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
├── SettingFile/  
│   ├── .env  
│   ├── config.js  
│   ├── CorsConfig.js  
│   ├── Swagger.js  
│   ├── VScodeConfig.js  
│   └── Swagger.json  
├── app.js  
├── Database.db  
├── CrematoriumStatus.csv  
├── package.json  
├── package-lock.json  
└── README.md  

---

## 기술 스택
### 언어
- **Node.js (Express.js)** : 메인 서버 프레임워크
- **Python 3.x** : 머신러닝 모델 실행 및 예측

### DB
- **SQLite3** : 경량 데이터베이스 (예약, 사용자, 관리자 정보 저장)
- **CSV 파일 (CrematoriumStatus.csv)** : 화장장 상태 데이터 관리



---

## 데이터베이스
본 프로젝트는 **SQLite3**를 주요 데이터베이스로 사용하며, 일부 데이터는 **CSV 파일(CrematoriumStatus.csv)**을 통해 관리합니다.  
`createDB.js`를 통해 서버 초기화 시 자동으로 테이블이 생성되고, 샘플 데이터가 삽입됩니다.



### 테이블 구조

#### 1. `admin_user`
- **설명:** 관리자 계정 정보를 저장하는 테이블입니다.  
- **특징:**  
  - ID는 기본 키  
  - 비밀번호는 중복 불가  
  - 소속 시설명은 중복 가능 (Crematorium 테이블과 연계)  
- **컬럼:**  
  - `id` (PK) : 관리자 ID  
  - `password` (NOT NULL) : 비밀번호  
  - `facility` : 소속 시설명  

---

#### 2. `Crematorium`
- **설명:** 전국 화장장 시설 정보를 저장합니다. 보건복지부 화장시설 CSV 파일에서 자동 삽입됩니다.  
- **특징:**  
  - 기본 정보(주소, 연락처, 홈페이지 등)  
  - 부대시설 여부(식당, 매점, 주차장, 대기실, 장애인 편의시설 등)  
- **컬럼:**  
  - `facilityName` (PK) : 시설명  
  - `province` (NOT NULL) : 시/도  
  - `district` (NOT NULL) : 시/군/구  
  - `address` (NOT NULL) : 주소  
  - `phoneNumber` (NOT NULL) : 전화번호  
  - `website` : 홈페이지 주소  
  - `parkingCapacity` : 주차 가능 대수  
  - `ownershipType` : 공공/사설 구분  
  - `cremationUnits` : 화장로 수  
  - `hasRestaurant` : 식당 여부  
  - `hasStore` : 매점 여부  
  - `hasParkingLot` : 주차장 여부  
  - `hasWaitingRoom` : 유족 대기실 여부  
  - `hasAccessibilityFacilities` : 장애인 편의시설 여부  

---

#### 3. `reservationList`
- **설명:** 예약 내역을 관리하는 테이블입니다.  
- **특징:**  
  - 예약자와 고인 정보를 기록  
  - 관리자들이 시설·시간·화장 횟수를 관리할 수 있도록 지원  
  - 통계 분석 및 예측 모델 학습 데이터로 활용 가능  
- **컬럼:**  
  - `id` (PK) : 예약자 ID  
  - `name` : 예약자 이름  
  - `facility` : 예약 시설명  
  - `date` : 예약 일시  
  - `numberOfcremation` : 화장로 번호(또는 회차)  
  - `deadPersonName` : 고인 이름  

---

#### 4. `user`
- **설명:** 사용자 기본 정보를 저장하는 테이블입니다.  
- **특징:**  
  - 현재는 활용도가 낮지만, 공공기관 공유 및 추후 확장 대비용  
- **컬럼:**  
  - `name` (PK) : 사용자 이름  
  - `date` : 등록일  
---

## API

### 1) Admin User API

#### 1. 관리자 로그인
**API 종류**  
GET  

**설명**  
관리자 계정으로 로그인하여 JWT 토큰을 발급받습니다.  

**요청 예시**  
/login?id=admin01&password=pass123  

**응답 예시**  
{ "message": "로그인 성공", "token": "eyJhbGciOi..." }

---

#### 2. 관리자 정보 수정
**API 종류**  
PUT  

**설명**  
관리자의 비밀번호와 소속 화장장이름을 수정합니다.  

**요청 예시**  
{ "password": "newpassword123", "facility": "서울추모공원" }

**응답 예시**  
{ "message": "관리자 정보 수정 완료" }

---

#### 3. 관리자 삭제
**API 종류**  
DELETE  

**설명**  
관리자 계정을 삭제합니다.  

**요청 예시**  
{ "id": "admin01", "password": "mypassword123" }

**응답 예시**  
{ "message": "삭제되었습니다. 그동안 이용해주셔서 감사합니다" }

---

#### 4. 관리자 회원가입
**API 종류**  
POST  

**설명**  
새로운 관리자 계정을 등록합니다.  

**요청 예시**  
{ "id": "admin01", "password": "pass123" }

**응답 예시**  
{ "message": "관리자 등록이 완료되었습니다.", "id": "admin01" }

---

### 2) Crematorium API

#### 1. 시설 정보 조회
**API 종류**  
GET  

**설명**  
시설명을 기반으로 상세 정보를 조회합니다.  

**요청 예시**  
/facility?search=서울시립승화원  

**응답 예시**  
{  
  "province": "서울특별시",  
  "district": "강남구",  
  "facilityName": "서울시립승화원",  
  "address": "서울시 강남구 ...",  
  "phoneNumber": "02-123-4567",  
  "cremationUnits": 10  
}

---

### 3) Reservation API

#### 1. 예약 등록
**API 종류**  
POST  

**설명**  
새로운 화장장 예약을 등록합니다.  

**요청 예시**  
{  
  "name": "홍길동",  
  "id": "user123",  
  "date": "2025-09-15T10:00:00",  
  "numberOfcremation": 3,  
  "deadPersonName": "김철수",  
  "facility": "서울시립승화원"  
}

**응답 예시**  
{ "message": "예약이 등록되었습니다.", "id": "user123" }

---

#### 2. 예약 확인
**API 종류**  
GET  

**설명**  
특정 예약자의 예약 목록을 조회합니다.  

**요청 예시**  
/checkReservations/user123  

**응답 예시**  
{  
  "id": "user123",  
  "name": "홍길동",  
  "date": "2025-09-15",  
  "numberOfcremation": 2,  
  "deadPersonName": "김철수",  
  "facility": "서울시립승화원"  
}

---

#### 3. 예약 수정
**API 종류**  
PUT  

**설명**  
예약자의 정보를 수정합니다.  

**요청 예시**  
{  
  "name": "홍길동",  
  "date": "2025-09-13 10:00:00",  
  "numberOfcremation": 2,  
  "deadPersonName": "김철수"  
}

**응답 예시**  
{ "message": "예약자 정보 수정 완료" }

---

#### 4. 예약 취소
**API 종류**  
DELETE  

**설명**  
예약자의 예약 정보를 삭제합니다.  

**요청 예시**  
{ "id": "user123", "name": "홍길동" }

**응답 예시**  
{ "message": "예약자 삭제 완료" }

---

#### 5. 지난 예약 삭제
**API 종류**  
DELETE  

**설명**  
현재 날짜 기준으로 이미 지난 예약들을 일괄 삭제합니다.  

**요청 예시**  
(Body 없음)  

**응답 예시**  
{ "message": "5개의 지난 예약이 삭제되었습니다." }

---

### 4) Common API

#### 1. 테이블 조회
**API 종류**  
GET  

**설명**  
지정한 테이블의 모든 데이터를 조회합니다.  

**요청 예시**  
/table/admin_user  

**응답 예시**  
{  
  "id": "admin01",  
  "password": "pass123",  
  "facility": "Seoul Crematory"  
},  
{  
  "id": "admin02",  
  "password": "secure456",  
  "facility": "Busan Memorial"  
}

---

## 현재 구현 상태
- **Admin User:** 로그인, 정보 수정, 삭제, 회원가입  
- **Crematorium:** 시설 정보 조회  
- **Reservation:** 예약 등록, 확인, 수정, 취소, 지난 예약 삭제  
- **Common:** 테이블 전체 조회  
