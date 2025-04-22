# 일정 관리 웹 애플리케이션 (ToDo + Calendar)

이 프로젝트는 개인 일정 관리를 위한 ToDo 및 캘린더 기능을 통합한 풀스택 웹 애플리케이션입니다. 사용자는 날짜별로 할 일을 등록하고, 우선순위와 키워드로 분류하며, 전체 일정은 캘린더 뷰를 통해 시각적으로 확인할 수 있습니다.

## 1. 기능 요약

### 기본 기능

- 일정 등록 / 조회 / 수정 / 삭제 (CRUD)
- 우선순위 설정 (낮음 / 중간 / 높음)
- 키워드 태그 기능
- 날짜별 일정 조회
- 전체 일정 캘린더 렌더링

### 추가 구현 기능

- 키워드 기반 필터 기능
- 우선순위 기반 색상 시각화
- 날짜별 일정 미리보기 + 상세 페이지 분리

---

## 2. 실행 방법

### 2.1 백엔드 (Spring Boot)

```bash
# 환경
Java 17
MySQL 8.x
Spring Boot 3.x

# 실행
./gradlew bootRun
```

```yml
url: jdbc:mysql://localhost:3306/todo_db
username: root
password: 1111
driver-class-name: com.mysql.cj.jdbc.Driver
```

### 2.2 프론트엔드 (React)

```bash
# 환경
Node.js >= 18
React 18 + Vite

# 실행
npm install
npm run dev
```

### 2.3 MySQL 초기 스키마

```sql
CREATE TABLE schedule (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  content VARCHAR(255) NOT NULL,
  priority_level INT,
  keyword VARCHAR(255)
);
```

초기데이터

```sql
INSERT INTO schedule (date, content, priority_level, keyword) VALUES

('2025-03-03', '기획 회의', 2, '기획'),
('2025-03-09', '디자인 회의', 1, '디자인'),
('2025-03-15', '개발 일정 조율', 3, '개발'),
```

---

## 3. 주요 라이브러리 및 기술 스택

| 구분          | 사용 기술                | 비고                         |
| ------------- | ------------------------ | ---------------------------- |
| 프론트엔드    | React, Vite, Zustand     | 컴포넌트 단위 개발           |
| UI 라이브러리 | Ant Design               | 빠른 UI 구성                 |
| 서버 사이드   | Spring Boot, JPA, Lombok | RESTful API 및 ORM 기반      |
| 데이터베이스  | MySQL                    | 관계형 DB                    |
| 테스트        | JUnit, MockMvc           | 단위 / 통합 테스트 구성 가능 |
| 기타          | React Query              | API 캐싱 및 요청 관리        |

---

## 4. API 명세

Swagger UI는 적용되지 않았지만 아래와 같은 엔드포인트 제공

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | /schedules          | 전체 또는 날짜별 조회   |
| POST   | /schedules          | 일정 생성               |
| PUT    | /schedules/{id}     | 일정 수정               |
| DELETE | /schedules/{id}     | 일정 삭제               |
| GET    | /schedules/keywords | 사용된 키워드 목록 조회 |

---

## 5. 테스트 코드

JUnit5 및 Spring Boot Test 환경 구성.

- 테스트 클래스: `ScheduleControllerTest.java` 작성
- `@SpringBootTest` 및 `@Transactional`을 통해 실제 DB에 연결한 테스트 수행
- 테스트 데이터는 자동 롤백 처리되어 별도의 목서버(mock server) 없이 실제 환경 기반 테스트 진행

## 5-2 테스트 케이스

- testAddSchedule(): 새 일정을 추가하는 API에 대한 테스트입니다. 요청 본문에 일정을 담고, 응답을 검증합니다.
- testGetSchedulesByDate(): 특정 날짜에 해당하는 일정을 조회하는 API를 테스트합니다. 특정 날짜에 저장된 일정을 확인합니다.
- testGetSchedulesByKeyword(): 키워드를 기준으로 일정을 조회하는 API를 테스트합니다. GET /schedules/keywords 엔드포인트를 호출하고 키워드를 조회합니다.
- testUpdateSchedule(): 특정 일정의 내용을 수정하는 API를 테스트합니다. 일정 ID를 통해 수정된 값을 확인합니다.
- testDeleteSchedule(): 일정을 삭제하는 API를 테스트합니다. 삭제 후, 해당 일정이 조회되지 않음을 확인합니다.

---

## 6. 추가기능

- 투두리스트 컨텐츠 중요도 개발
- 키워드 API 개발하여 필터링 기능 개발
