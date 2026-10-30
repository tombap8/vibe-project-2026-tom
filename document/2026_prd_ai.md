# 한미그룹 2026 채용 마이크로사이트 바이브코딩 종합 마스터 가이드

본 문서는 `https://2026recruitment.hanmi.co.kr/` 사이트의 소스 구조(Bootstrap, Swiper, Pretendard, NiceSelect, Component/Program CSS 등)를 역추적 분석하여 작성된 통합 문서입니다.

---

## 목차
1. [01_GLOBAL_PRD] 종합 제품 요구사항 정의서
2. [02_FRONTEND_PRD] 프론트엔드 개발 상세 사양서
3. [03_ACTIONABLE_PRD_SUMMARY] 바이브코딩 실행용 핵심 요약서
4. [04_DEV_AI_AGENT] 개발 전담 AI 에이전트 프롬프트
5. [05_DESIGNER_AGENT] 디자이너 에이전트 가이드라인
6. [06_DEVELOPER_AGENT] 테크 리드 & 개발자 표준화 규약

---

# [01_GLOBAL_PRD] 종합 제품 요구사항 정의서

## 1. 프로젝트 개요
- **서비스명**: 한미그룹 2026 신입/경력 공개채용 마이크로사이트
- **목적**:
  - 한미그룹의 미래 비전과 제약 R&D 인재상 전달
  - 직무 정보(R&D, 임상, 제약영업, 생산/품질, 경영지원)의 직관적 탐색 환경 제공
  - 간소화된 전형 일정 확인 및 실시간 입사 지원 전환 유도
- **타깃 사용자**: 신입 구직자, 경력 이직 희망자, 연구인력, 모바일 및 데스크톱 환경의 구직자
- **운영 플랫폼**: 크로스 디바이스 반응형 웹 (모바일 우선 대응)

## 2. 핵심 정보 구조 (Information Architecture)
1. **GNB & 헤더**:
   - 로고 (한미약품/한미사이언스/한미정밀화학 그룹 아이덴티티)
   - 네비게이션: 채용 안내(About), 모집 부문(Program), 전형 절차(Schedule), 복리후생(Culture), FAQ
   - 액션: [지원서 접수 바로가기] 상시 노출 버튼
2. **Hero Section (메인 배너)**:
   - 2026 채용 슬로건 타이포그래피 비주얼
   - Swiper 기반 비주얼/스토리 롤링 카드
   - 실시간 접수 D-Day 카운트다운 타이머
3. **Program (모집 요강 & 직무 탐색)**:
   - 직군별 탭 필터 (R&D / 임상 / 제약영업 / 생산·품질 / 경영관리)
   - 세부 직무 리스트 카드 (직무명, 근무지, 경력구분, 지원기간, 배지)
   - 직무 클릭 시 상세 요구 역량, 수행 업무, 우대사항 모달/드로어 노출
4. **Schedule (전형 일정 및 단계)**:
   - 서류전형 → AI 인적성 역량검사 → 1차 실무면접 → 2차 임원면접 타임라인
   - 단계별 상세 일정 및 지원자 유의사항 안내
5. **Culture & Benefit (복리후생 & 연구환경)**:
   - 한미 R&D 인프라 및 근무 복지 카드 그리드
6. **FAQ & Help Desk**:
   - 카테고리별(지원자격, 전형절차, 연구소근무, 기타) 아코디언 질의응답
   - 채용 문의처 및 유의사항 공지
7. **Footer & Mobile Sticky CTA**:
   - 저작권, 개인정보처리방침, 패밀리 사이트 링크
   - 모바일 전용 하단 플로팅 '지금 지원하기' 바

## 3. 핵심 성과 지표 (KPI)
- 공고 탐색 후 채용 사이트 이동 전환율(CTR): 35% 이상
- 모바일 환경에서의 첫 화면 렌더링(FCP): 1.2초 미만, LCP 2.0초 미만
- 직무 필터링 인터랙션 응답 지연: 50ms 미만 (Zero Layout Shift)

---

# [02_FRONTEND_PRD] 프론트엔드 개발 상세 사양서

## 1. 기술 스택 및 라이브러리 사양
- **기반 레이아웃**: Bootstrap 5 Responsive Grid System (`container`, `row`, `col-*`)
- **슬라이더 엔진**: Swiper.js (CSS: `swiper.css`)
- **타이포그래피**: Pretendard Dynamic Subset (`pretendard-dynamic-subset.min.css`)
- **아이콘 시스템**: FontAwesome 6 WebFont (`font-awesome.min.css`)
- **폼 및 컨트롤**: Custom Dropdown / Select UI (기존 `niceselect.css`를 최신 무의존 컴포넌트로 구현)
- **일정 컴포넌트**: Timeline & Schedule Indicator (`datepicker.css` 패턴 흡수)

## 2. 파일 구조 및 역할 분담 (CSS 아키텍처 계승)
```
src/
├── styles/
│   ├── reset.css           # 브라우저 기본 스타일 초기화
│   ├── bootstrap.min.css   # 반응형 12컬럼 그리드
│   ├── font-face.css       # Pretendard 웹폰트 정의
│   ├── component.css       # 공통 UI (버튼, 배지, 카드, 모달)
│   ├── content.css         # 비주얼/본문 콘텐츠 타이포그래피
│   ├── program.css         # 채용 공고(Program) 및 타임라인 전용
│   ├── responsive.css      # 디바이스별 미디어쿼리 규칙
│   └── custom.css          # 프로젝트 고유 테마 및 유틸리티
├── components/
│   ├── Header.tsx          # GNB + 반응형 모바일 햄버거 메뉴
│   ├── HeroSlider.tsx      # Swiper 캐러셀 + D-Day 타이머
│   ├── JobFilter.tsx       # 탭 및 드롭다운 실시간 필터
│   ├── JobCardGrid.tsx     # 직무 목록 카드 그리드
│   ├── JobDetailModal.tsx  # 상세 채용 요강 팝업
│   ├── ProcessTimeline.tsx # 단계별 채용 일정 인디케이터
│   ├── FaqAccordion.tsx    # 1열 접이식 FAQ
│   └── StickyCTA.tsx       # 모바일 하단 플로팅 지원 버튼
└── data/
    ├── jobsData.ts         # 직무별 상세 스펙 목데이터
    └── faqData.ts          # FAQ 질의응답 목데이터
```

## 3. 디바이스 브레이크포인트 규격 (`responsive.css`)
- **Mobile (< 768px)**:
  - 1열 카드 레이아웃, 모바일 풀스크린 햄버거 드로어
  - 하단 Sticky CTA 상시 고정 (`bottom: 0; z-index: 1000`)
- **Tablet (768px ~ 991px)**:
  - 2열 카드 그리드 (`col-md-6`), 여백 및 타이포 스케일 최적화
- **Desktop (≥ 992px)**:
  - 최대 1200px / 1320px 컨테이너 중앙 정렬
  - 호버 인터랙션 활성화 및 3열 카드 그리드 (`col-lg-4`)

---

# [03_ACTIONABLE_PRD_SUMMARY] 바이브코딩 실행용 핵심 요약서

## 1. 1차 스프린트 MVP 구현 체크리스트
1. **Layout & Hero**:
   - [ ] Pretendard 폰트 및 모바일/데스크톱 그리드 셋업
   - [ ] Swiper 메인 비주얼 배너 및 D-Day 카운트다운 타이머 배치
2. **Program (직무 필터)**:
   - [ ] 직군 카테고리(R&D, 생산, 영업 등) 탭 클릭 시 실시간 목록 변경
   - [ ] 카드 클릭 시 상세 모달 팝업 및 배경 스크롤 차단(`body { overflow: hidden }`)
3. **Schedule & FAQ**:
   - [ ] 4단계 전형 절차 시각화 타임라인 컴포넌트
   - [ ] 토글 애니메이션이 적용된 FAQ 아코디언 컴포넌트
4. **Mobile Polish**:
   - [ ] 하단 고정 플로팅 지원 바 및 터치 스와이프 검증

## 2. 핵심 목데이터(Mock Data) 인터페이스
```typescript
export interface JobItem {
  id: string;
  category: 'R&D' | '임상' | '제약영업' | '생산/품질' | '경영관리';
  title: string;
  career: '신입' | '경력' | '신입/경력';
  location: string;
  period: string;
  dDay: number;
  tasks: string[];
  requirements: string[];
  preferences: string[];
  status: '접수중' | '마감임박' | '접수마감';
}
```

---

# [04_DEV_AI_AGENT] 개발 전담 AI 에이전트 프롬프트

```markdown
당신은 최고 수준의 시니어 프론트엔드 엔지니어입니다.
한미그룹 채용 마이크로사이트의 구조(`bootstrap.css`, `swiper.css`, `program.css`, `component.css`)를 이해하고 있으며, 사용자의 바이브코딩 프롬프트에 맞춰 즉시 동작하는 프로덕션급 클린 코드를 작성합니다.

### 실행 원칙
1. 의존성 격리:
   - 레거시 jQuery 플러그인(NiceSelect 등) 대신 순수 JavaScript 또는 React 상태 기반 Custom Dropdown을 생성합니다.
   - 외부 라이브러리는 공인 CDN 또는 안정된 모듈 방식을 사용합니다.
2. 예외 및 런타임 오류 방어:
   - 배열 맵핑 및 객체 프로퍼티 접근 시 옵셔널 체이닝(`?.`)과 기본값 처리를 필수로 적용합니다.
   - 직무 필터링 결과가 없을 경우 사용자 친화적인 Empty UI를 제공합니다.
3. 성능 및 반응형 준수:
   - 브라우저 리플로우를 유발하지 않도록 애니메이션은 `transform`과 `opacity` 위주로 제어합니다.
   - 모바일 360px부터 4K 해상도까지 깨짐 없는 반응형 레이아웃을 보장합니다.
```

---

# [05_DESIGNER_AGENT] 디자이너 에이전트 가이드라인

```markdown
당신은 제약·바이오 채용 마이크로사이트의 시각적 완성도와 신뢰성을 총괄하는 시니어 프로덕트 디자이너입니다.

### 디자인 시스템 토큰 규격
1. Color System:
   - Primary: #003876 (한미 딥블루 - 전문성, 신뢰도)
   - Secondary: #00A3E0 (사이언스 시안 - 바이오 혁신성)
   - Neutral: Text #212529, Subtext #6C757D, Background #F8F9FA, Border #E9ECEF
   - State: Badge 접수중 #00875A, 마감임박 #DE350B
2. Typography Hierarchy (Pretendard):
   - Hero Title: 데스크톱 44px (Line-height 1.3), 모바일 28px (Line-height 1.35)
   - Section Title: 데스크톱 32px, 모바일 22px (Bold)
   - Body Text: 16px (Regular/Medium, Line-height 1.6)
3. Component Micro-Interactions:
   - Job Card: 기본 테두리 #E9ECEF, Hover 시 translateY(-4px) 및 그림자 0 10px 25px rgba(0,0,0,0.08)
   - Button: 최소 높이 48px(모바일 52px), 모바일 환경 100% Full Width 적용
```

---

# [06_DEVELOPER_AGENT] 테크 리드 & 개발자 표준화 규약

```markdown
당신은 바이브코딩 산출물의 아키텍처 정합성과 코드 품질을 점검하는 테크니컬 리드입니다.

### 품질 및 구현 규약
1. 클래스 네이밍 및 BEM 패턴:
   - `component.css`와 `program.css` 규칙을 따라 의미론적인 클래스명을 사용합니다.
   - 예: `.recruit-card`, `.recruit-card__badge--active`, `.schedule-step--current`
2. 웹 접근성(a11y) 기준:
   - 모달 활성화 시 포커스 트랩(Focus Trap) 및 ESC 키 닫기 이벤트 리스너 등록
   - 탭 및 드롭다운 컨트롤에 ARIA 속성(`role="tab"`, `aria-selected="true"`) 명시
3. 코드 산출물 전달 규칙:
   - 바이브코딩 시에는 복사/붙여넣기가 즉시 가능하도록 파일 최상단에 디렉터리 경로 주석을 명시합니다.
```