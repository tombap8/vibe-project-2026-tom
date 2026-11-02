# Discovery Expedition Clone Project

디스커버리 익스페디션 공식 온라인몰 타깃 클론 웹 프로젝트입니다.  
**HTML5 / CSS3 / Vanilla JavaScript (ES2022+)** 기반으로 빌드 도구와 프레임워크 없이 순수 웹 표준으로 구현합니다.

---

## 🚨 개발 시작 전 필독 (Agent & Developer Notice)

> **모든 작업(코드 작성, 수정, 리팩토링)을 시작하기 전, 반드시 아래 규약 문서를 정독하고 작업에 착수해야 합니다.**

* 📖 **핵심 규약 문서**: [`spec-kit/AGENTS.md`](./spec-kit/AGENTS.md)
* 문서 내 명시된 **MUST / MUST NOT 규칙은 예외 없이 준수**합니다.
* 충돌 발생 시 우선순위:
  $$\text{접근성·보안} > \text{사용자 요구 명세} > \text{AGENTS.md (PART 3 우선)} > \text{성능} > \text{개인 취향}$$

---

## 📌 핵심 작업 규칙 요약

### 1. 3단 레이아웃 계층 엄수 (최대 4단계)
동의어 클래스(`container`, `wrapper`, `row` 등) 사용을 엄격히 금지합니다.
```text
겉박스 (.outer-box)          ← header / main > section / footer (100% 폭, 배경·세로 여백 담당)
 └─ 속박스 (.inner-box)       ← max-width(1920px) + 중앙 정렬 + 좌우 패딩 담당
     └─ 파티션 박스 (.part-box) ← display: flex (Grid 금지, gap 간격 분담)
         └─ 내용 박스          ← 컴포넌트 단위 (필요 시 내부 Grid 허용)
```

### 2. 디자인 토큰 기반 구현 (하드코딩 금지)
* 색상·글자 크기·간격·반경 등 모든 수치는 `/css/tokens.css` 변수만 참조합니다.
* **디자인 실측치 우선**: PART 1의 기본 8pt/스케일보다 **PART 3의 실측값(✅)**을 최우선 적용합니다.
* **완전한 모노톤 UI**: 흑·백·회색만 사용하며, 임의의 유채색 포인트 컬러를 추가하지 않습니다.

### 3. 클린 & 시맨틱 코드
* **No Library / No Framework**: 승인되지 않은 외부 라이브러리, CDN, 폰트 임의 추가 금지.
* 시맨틱 태그 준수 (`main` 단 1개, 단일 `h1`, 클릭 요소는 `<button>` 또는 `<a>` 필수).
* 인라인 스타일, `!important`, `id` 선택자 스타일링, 불필요한 서술형 AI 주석 작성 금지.

---

## 📁 디렉터리 구조

```text
/
├─ spec-kit/
│  └─ AGENTS.md            # 에이전트 및 디자이너/개발자 통합 코딩 규약
├─ README.md               # 프로젝트 시작 안내 및 작업 지침 (본 문서)
├─ index.html              # 메인 진입점
├─ pages/                  # 서브 페이지 (kebab-case.html)
├─ assets/
│  ├─ images/              # webp / avif 우선
│  ├─ icons/               # SVG only
│  └─ fonts/               # woff2 only (Pretendard, Plus Jakarta Sans)
├─ css/
│  ├─ tokens.css           # 디자인 토큰
│  ├─ base.css             # reset + 기본 요소 스타일
│  ├─ layout.css           # 겉박스·속박스·파티션 박스 구조
│  ├─ components/          # 컴포넌트 단위 스타일
│  ├─ utilities.css        # 최소 유틸리티 (.visually-hidden 등)
│  └─ main.css             # CSS 로드 관리 (@layer 사용)
└─ js/
   ├─ main.js              # 엔트리 포인트 (type="module")
   ├─ modules/             # 기능 단위 모듈
   ├─ utils/               # 순수 헬퍼 함수
   └─ config.js            # 상수 및 설정
```

---

## 📋 완료 전 체크리스트

작업을 완료하거나 커밋하기 전 [`spec-kit/AGENTS.md`](./spec-kit/AGENTS.md)의 **PART 4 체크리스트**를 반드시 자체 검수하세요.
- [ ] 레이아웃 규칙 준수 여부 (`.outer-box` > `.inner-box` > `.part-box`)
- [ ] 토큰 하드코딩 유무 확인
- [ ] 키보드 접근성 및 시맨틱 마크업 검증
- [ ] 불필요한 `console.log` 및 임시 텍스트(`TODO`, `test` 등) 제거