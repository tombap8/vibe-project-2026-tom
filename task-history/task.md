# 작업 이력 및 다음 작업 안내

## 프로젝트

- Discovery Expedition 공식 온라인몰을 참고한 순수 HTML/CSS/Vanilla JavaScript 클론.
- 프레임워크나 빌드 도구 없이 `index.html`을 진입점으로 사용한다.
- 작업 전 `readme.md`와 `spec-kit/AGENTS.md`를 확인하고, 특히 PART 3의 사이트별 레이아웃·토큰 규약을 따른다.

## 완료된 작업

1. **상단 헤더 및 카테고리 네비게이션**:
   - Discovery 로고, 카테고리 칩 탭(여성, 남성, 신발, 용품, 키즈), 우측 유틸리티 버튼(검색, 장바구니, 마이페이지, 전체 메뉴) 구성.
   - 모바일 뷰포트 대응: 상단 로고/유틸리티 숨김 및 하단 탭바(카테고리, 검색, 홈, 장바구니, 마이) 표시.
2. **히어로 풀페이지 섹션 (1, 2, 3페이지)**:
   - `main#main-content` 하위에 `section.hero` 3개 페이지(`hero--slide-1`, `hero--slide-2`, `hero--slide-3`) 구성.
   - 1페이지: `DISCOVER MY ACTIVE WINTER` (`discovery-dt-68.jpg` / `discovery-mob-50.jpg`)
   - 2페이지: `AIRWELL, THEIR WAY` (`discovery-dt-62.jpg` / `discovery-mob-46.jpg`)
   - 3페이지: `Discover My Active Wellness` (`discovery-dt-67.jpg` / `discovery-mob-42.jpg`)
   - 데스크톱 마우스 휠 1번에 한 페이지만 정확히 이동하는 스크롤 락 및 CSS `scroll-snap` 적용.
   - 우측 세로 인디케이터(`hero__pagination`) 연동: 현재 위치 실시간 흰색 하이라이트 및 클릭 시 섹션 이동 지원.
3. **전체 메뉴 모달 (`full-menu`)**:
   - 햄버거 메뉴 버튼 클릭 시 데스크톱 페이드인, 모바일 오른쪽 슬라이딩 애니메이션.
   - 배경 스크롤 잠금(`inert`), sticky 분류 탭, 서브 카테고리 및 상품 썸네일 그리드 구현.
4. **상단 검색 모달 (`search-modal`)**:
   - 상단/하단 검색 돋보기 버튼 클릭 시 화면 전체를 덮는 fixed 모달 구현.
   - 상단 검색창 + 닫기(X) 라인 고정(`sticky`), 하단 콘텐츠 독립 스크롤.
   - 최근 검색어(개별 삭제, 전체삭제 지원) 및 1~10위 인기 검색어 랭킹 리스트 구현.
   - 이번주 BEST 탭 및 5종 상품 카드(랭킹 뱃지, 가격, 색상 스와치 칩, 좋아요/댓글 수) 구현.
   - "온라인 공식몰 회원 특별 혜택" 테크니컬 그리드 프로모션 배너 구현.
   - 모바일 미디어쿼리 대응: 인기 검색어 바로 아래에 혜택 배너 배치, 상품 카드 가로 스와이프 탐색 최적화.
   - ESC 키 닫기, 키보드 Tab 트랩, 포커스 복원 및 메인 스크롤 인터셉트 방지.

## 주요 파일

- `index.html`: 메인 진입점 및 시맨틱 마크업
- `css/tokens.css`: 디자인 토큰 (컬러, 타이포그래피, 간격, 모션 등)
- `css/base.css`: reset 및 기본 요소 스타일, 스크롤 스냅 설정
- `css/layout.css`: 3단 레이아웃 계층 (.outer-box > .inner-box > .part-box)
- `css/components/header.css`: 상단 헤더 및 카테고리 칩 스타일
- `css/components/hero.css`: 히어로 1~3페이지 및 인디케이터, 플로팅 버튼, 탭바 스타일
- `css/components/full-menu.css`: 전체 메뉴 모달 스타일
- `css/components/search-modal.css`: 검색 화면 고정 오버레이 모달 스타일
- `css/utilities.css`: 접근성 유틸리티 (.visually-hidden 등)
- `css/main.css`: CSS 레이어 관리 및 엔트리
- `js/main.js`: 전체 메뉴, 풀페이지 스크롤, 검색 모달 상호작용 제어 엔트리

## 다음 작업 시 유의사항

1. 이미 완료된 헤더, 히어로(1~3페이지), 전체 메뉴, 검색 모달을 중복으로 다시 생성하지 않는다.
2. 레이아웃 작성 시 `.outer-box` > `.inner-box` > `.part-box` 계층을 엄수하며 동의어 클래스(`container`, `wrapper` 등)를 사용하지 않는다.
3. CSS 수치는 반드시 `css/tokens.css`의 토큰 변수를 사용하고 인라인 스타일 및 `!important`를 지양한다.
4. 모달이나 팝업 구현 시 접근성 속성(`role="dialog"`, `aria-modal="true"`, `aria-hidden`, `inert`, 키보드 트랩/복원)을 반드시 유지한다.
5. 이미지 경로는 `images/used/` 디렉터리에 복사/매칭된 파일들을 우선 사용한다.

---

## 작업 히스토리 상세

### 2026-11-03 — 반응형 히어로 구현
- `images/used`의 데스크톱/모바일 배경 이미지와 제공된 SVG 로고·아이콘을 연결했다.
- 히어로 그라디언트, 고정 슬라이드 인디케이터, 채팅/최근 본 상품 플로팅 버튼을 구현했다.
- 모바일에서 상단 로고/유틸리티를 숨기고 하단 카테고리·검색·홈·장바구니·마이 내비게이션을 추가했다.
- CSS 토큰 및 컴포넌트 미디어 쿼리를 Desktop First와 `max-width: 768px` 기준으로 정리했다.

### 2026-11-03 — 전체 메뉴 반응형 구현
- 데스크톱 헤더와 모바일 카테고리 버튼에 연결되는 전체 메뉴 다이얼로그를 추가했다.
- 모바일 슬라이드/데스크톱 페이드 전환, 배경 스크롤 잠금, 메뉴 내부 스크롤과 sticky 분류 탭을 구현했다.
- 여성·남성·신발·용품·키즈·아울렛 탭 콘텐츠에 `images/menu` 상품 이미지를 연결했다.
- 키보드 탭 전환, Escape 닫기, 포커스 이동 및 복원, 배경 콘텐츠 inert 처리를 적용했다.

### 2026-11-03 — 2번째, 3번째 페이지 및 풀페이지 원스크롤 구현
- `main` 태그 내부에 1번째 페이지와 동일한 3단 계층(`.outer-box` > `.inner-box` > `.part-box`)으로 2번째(`hero--slide-2`), 3번째(`hero--slide-3`) 섹션을 구성했다.
- 제공된 이미지를 정밀 분석하여 적합한 데스크톱/모바일 배경 이미지를 `images/used/`에 복사 및 매칭했다.
  - 2번째 슬라이드: 데스크톱 `discovery-dt-62.jpg` / 모바일 `discovery-mob-46.jpg` (타이틀: `AIRWELL, THEIR WAY`, 설명: `에어웰로 완성한 취향이 돋보이는 겨울 스타일`)
  - 3번째 슬라이드: 데스크톱 `discovery-dt-67.jpg` / 모바일 `discovery-mob-42.jpg` (타이틀: `Discover My Active Wellness`, 설명: `가벼운 보온 기능에 감각적인 스타일을 더한 에어웰 경량패딩`)
- 상단 헤더, 모바일 탭바, 우측 플로팅 버튼 등의 고정 UI를 그대로 유지했다.
- 우측 슬라이드 인디케이터를 전역 고정 내비게이션으로 확장하고 키보드 접근성 및 클릭 전환을 지원하도록 구현했다.
- CSS `scroll-snap-type: y mandatory` 및 `scroll-snap-align: start; scroll-snap-stop: always;`와 함께 마우스 휠 단위 스크롤 제어 JS(`initFullPageScroll()`)를 구현하여 마우스 휠 1번에 한 페이지만 정확하게 이동하도록 처리했다.
- `IntersectionObserver`로 현재 뷰포트에 위치한 페이지를 실시간 감지하여 오른쪽 인디케이터의 활성 바가 흰색으로 정확히 표시되도록 연동했다.

### 2026-11-03 — 상단 검색 모달(Fixed Full Overlay) 반응형 구현
- 상단 헤더 및 모바일 하단 탭바의 검색 아이콘(돋보기) 클릭 시 전체 화면을 덮는 고정 모달(`.search-modal`)을 구현했다.
- 상단 라인(검색어 입력창, 돋보기 아이콘, X 닫기 버튼)은 `position: sticky; top: 0;`로 화면 상단에 고정하고 하단 영역 전체가 스크롤되도록 분리했다.
- 최근 검색어(개별 삭제, 전체삭제 지원) 및 인기 검색어 1~10위 랭킹 리스트(번호 뱃지, 9번 '바람막이' 하이라이트)를 구현했다.
- `images/img-dt`의 고해상도 리소스를 기반으로 `images/used/`에 5종의 이번주 BEST 상품 이미지를 연결하고, 상품별 랭킹 뱃지, 타이틀, 가격, 컬러 스와치 칩, 좋아요/댓글 반응 아이콘을 구현했다.
  - 1위: 여성 픽토르U 구스다운 경량패딩 (`best-product-1.png`)
  - 2위: 남성 픽토르U 구스다운 경량패딩 (`best-product-2.jpg`)
  - 3위: 브릭 스니커즈 (`best-product-3.jpg`)
  - 4위: 레스터 보우 슬립온 (`best-product-4.jpg`)
  - 5위: 유니 테크플리스 후드 자켓 (`best-product-5.png`)
- 하단 파트: 테크니컬 그리드 오버레이와 함께 "온라인 공식몰 회원 특별 혜택" 프로모션 배너를 구현했다.
- 모바일 화면 분석 결과에 따라 미디어쿼리(`@media (max-width: 768px)`)를 적용하여 모바일에서는 인기 검색어 바로 아래에 프로모션 배너가 위치하고, 이번주 BEST 상품 카드가 가로 스와이프로 유연하게 탐색되도록 레이아웃 순서와 스크롤을 최적화했다.
- 검색 모달 열림 시 배경 inert 및 메인 풀페이지 스크롤 제어 잠금, Escape 닫기, 키보드 Tab 트랩, 포커스 복원 처리를 적용했다.

### 2026-11-04 — 헤더 내비게이션 중앙 정렬 및 상단 그라데이션 배경 적용
- `.header__navigation`을 수평 정중앙에 배치하기 위해 좌측 `.brand`와 우측 `.header__actions`에 동일한 `flex: 1 1 0` 및 정렬 스타일(`min-width: 0`)을 부여하여 대칭 플렉스 구조로 개선했다.
- 상단 메뉴 전체(`.outer-box--header`)에 위에서 아랫방향으로 검정색(40% 투명도)에서 투명색으로 전환되는 그라데이션 토큰(`--overlay-header: linear-gradient(180deg, rgb(0 0 0 / 40%) 0%, rgb(0 0 0 / 0) 100%)`)을 적용했다.
