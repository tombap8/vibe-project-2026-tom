# 순수 HTML/CSS/Vanilla JS 기반 프론트엔드 Spec-Kit

본 문서는 프레임워크(React, Vue 등) 없이 **순수 HTML5, CSS3, Vanilla JS(ES6+)**로 고성능·고품질의 인터랙티브 웹사이트를 바이브코딩할 때 사용하는 디자이너/개발자 표준 엔지니어링 규격서(Spec-Kit)입니다.

---

# PART 1. 디자이너 Spec-Kit (`DESIGNER_SPEC_KIT.md`)

## 1.1 디자인 철학 및 UI 메트릭스
* **스타일 정체성**: 제약·바이오 신뢰성(Deep Navy), 혁신적 연구개발(Vivid Cyan), 간결하고 현대적인 가독성
* **기본 측정 단위**: 4px / 8px 기반의 배수 시스템 (Grid & Spacing Scale)
* **터치 타깃 기준**: 모바일 환경 최소 터치 인터랙션 영역 $44 \times 44\text{px}$ 보장

## 1.2 디자인 토큰 정의 (CSS Custom Properties 규격)
개발자가 `styles/variables.css` 또는 `:root`에 바로 선언하여 사용할 수 있는 정량적 규격입니다.

```css
:root {
  /* Brand Color Tokens */
  --color-primary: #003876;          /* Deep Navy (한미 대표 신뢰 컬러) */
  --color-primary-hover: #002855;
  --color-secondary: #00A3E0;        /* Vivid Cyan (혁신/사이언스) */
  --color-secondary-light: #E5F6FD;

  /* Semantic State Colors */
  --color-status-open: #00875A;      /* 접수중 (Green) */
  --color-status-closing: #DE350B;   /* 마감임박 (Red) */
  --color-status-closed: #6B778C;    /* 마감 (Gray) */

  /* Neutral Surface & Typography */
  --color-bg-base: #FFFFFF;
  --color-bg-subtle: #F8F9FA;
  --color-text-main: #172B4D;
  --color-text-sub: #5E6C84;
  --color-text-muted: #8993A4;
  --color-border: #EBECF0;
  --color-border-hover: #C1C7D0;

  /* Typography Scale */
  --font-family-base: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-size-hero: clamp(1.875rem, 4vw + 1rem, 3rem);        /* 30px ~ 48px Fluid */
  --font-size-title: clamp(1.5rem, 2.5vw + 0.8rem, 2.25rem);   /* 24px ~ 36px */
  --font-size-subtitle: 1.25rem;                               /* 20px */
  --font-size-body: 1rem;                                      /* 16px */
  --font-size-caption: 0.875rem;                               /* 14px */
  --font-size-badge: 0.75rem;                                  /* 12px */

  --line-height-tight: 1.2;
  --line-height-normal: 1.6;

  /* Spacing Tokens */
  --space-xxs: 4px;
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-xxl: 80px;

  /* Radius & Shadows */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-pill: 9999px;

  --shadow-card: 0 4px 12px rgba(9, 30, 66, 0.08);
  --shadow-card-hover: 0 12px 28px rgba(9, 30, 66, 0.16);
  --shadow-modal: 0 20px 40px rgba(9, 30, 66, 0.24);

  /* Transition Tokens */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
}
```

## 1.3 반응형 레이아웃 그리드
* **Container Width**: Max $1280\text{px}$ (중앙 정렬, Padding: 좌우 $20\text{px}$)
* **Breakpoints**:
  * **Mobile**: $\le 767\text{px}$ (단일 1열 카드, 상단 햄버거 메뉴, 하단 고정 CTA)
  * **Tablet**: $768\text{px} \sim 1023\text{px}$ (2열 카드 그리드, 모달 패딩 축소)
  * **Desktop**: $\ge 1024\text{px}$ (3열 직무 카드 그리드, 호버 스케일 활성화)

## 1.4 핵심 컴포넌트 인터랙션 정의
1. **Recruitment Job Card (직무 카드)**:
   - **Default**: 테두리 `--color-border`, 배경색 `--color-bg-base`, 내부 여백 $24\text{px}$
   - **Hover (Desktop)**: `transform: translateY(-4px)`, 테두리 컬러 `--color-secondary`, 그림자 `--shadow-card-hover` 적용
   - **Active/Focus**: `outline: 2px solid var(--color-secondary)`, `outline-offset: 2px`
2. **Tab / Filter Control (직군 필터)**:
   - 활성 탭(Active)은 언더라인 바($3\text{px}$) 또는 Pill 형태의 색상 반전(`background: var(--color-primary); color: #fff;`)으로 전환 지연 없이 즉각 반응
3. **Modal Overlay (상세 요강 모달)**:
   - 배경 백드롭: `rgba(9, 30, 66, 0.54)` + `backdrop-filter: blur(4px)`
   - 진입 모션: 하단에서 살짝 올라오며 나타남 (`translateY(20px) -> translateY(0)`, Opacity $0 \to 1$)

---

# PART 2. 개발자 Spec-Kit (`DEVELOPER_SPEC_KIT.md`)

## 2.1 아키텍처 및 디렉터리 구조
프레임워크 없이 브라우저 기본 기능만으로 구동 가능한 모듈식 순수 파일 아키텍처입니다.

```
/
├── index.html              # 시맨틱 마크업 단일 엔트리포인트
├── css/
│   ├── reset.css           # 박스사이징 초기화 및 브라우저 기본 스타일 제거
│   ├── variables.css       # 디자이너 토큰(CSS 변수)
│   ├── layout.css          # Header, Footer, Grid, Container
│   ├── components.css      # Card, Button, Badge, Modal, Accordion
│   └── responsive.css      # @media 쿼리 규칙
├── js/
│   ├── data.js             # 채용 공고, FAQ 목데이터 (Array of Objects)
│   ├── dom.js              # DOM 캐싱 및 렌더링 헬퍼 유틸리티
│   ├── filter.js           # 직무 카테고리 실시간 필터링 엔진
│   ├── modal.js            # 상세 팝업 오픈/클로즈 & 포커스 트랩 & 스크롤 락
│   └── main.js             # 진입점 및 이벤트 리스너 통합 바인딩
└── assets/
    └── icons/              # SVG 인라인 또는 벡터 애셋
```

## 2.2 시맨틱 HTML5 마크업 가이드
* **WAI-ARIA 및 시맨틱 보장**:
  * 탭 네비게이션: `role="tablist"`, 개별 버튼 `role="tab"`, `aria-selected="true|false"`
  * 모달 팝업: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`
  * 아코디언 토글: `aria-expanded="true|false"`, `aria-controls="faq-answer-id"`
* **성능 최적화**:
  * 폰트 로드: `<link rel="preload" as="font" ... crossorigin>`
  * 스크립트 실행 지연: `<script type="module" src="js/main.js"></script>` 사용으로 전역 네임스페이스 오염 방지

## 2.3 순수 Vanilla JS 엔지니어링 표준
1. **ESM(ES Modules) 사용**: `import / export` 문법을 기본으로 모듈 간 책임을 분리합니다.
2. **이벤트 위임(Event Delegation) 패턴**:
   - 직무 카드나 아코디언 항목이 동적으로 교체될 때 매번 리스너를 붙이지 않고 상위 컨테이너(`document.querySelector('#job-grid')`)에 단일 이벤트 리스너를 등록합니다.
3. **상태 관리 및 리렌더링**:
   - 불필요한 전체 DOM 갱신을 방지하고 필터링 상태(`state = { category: 'ALL', search: '' }`) 변경 시 렌더링 함수(`renderJobList()`)만 선별 호출합니다.
4. **접근성 및 바디 락(Scroll Lock) 처리**:
   - 모달 활성화 시 `document.body.style.overflow = 'hidden'`, 비활성화 시 즉시 해제.
   - 모달 열림 시 `ESC` 키 입력 리스너(`e.key === 'Escape'`) 등록.

## 2.4 핵심 JavaScript 구현 참조 코드

### 1) 직무 필터링 및 렌더링 모듈 (`js/filter.js`)
```javascript
import { jobPostings } from './data.js';

export class JobManager {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentCategory = 'ALL';
  }

  setCategory(category) {
    this.currentCategory = category;
    this.render();
  }

  getFilteredJobs() {
    if (this.currentCategory === 'ALL') return jobPostings;
    return jobPostings.filter(job => job.category === this.currentCategory);
  }

  render() {
    const jobs = this.getFilteredJobs();
    if (jobs.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>해당 부문의 진행 중인 공고가 없습니다.</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = jobs.map(job => `
      <article class="job-card" data-id="${job.id}">
        <div class="job-card__header">
          <span class="badge badge--${job.statusType}">${job.status}</span>
          <span class="job-card__category">${job.category}</span>
        </div>
        <h3 class="job-card__title">${job.title}</h3>
        <p class="job-card__meta">${job.location} | ${job.career}</p>
        <div class="job-card__footer">
          <span class="job-card__period">${job.period}</span>
          <button type="button" class="btn btn--outline js-detail-btn" data-id="${job.id}">
            상세보기
          </button>
        </div>
      </article>
    `).join('');
  }
}
```

### 2) 모달 & 포커스 트랩 모듈 (`js/modal.js`)
```javascript
export class ModalManager {
  constructor(modalElement) {
    this.modal = modalElement;
    this.closeBtn = this.modal.querySelector('.js-modal-close');
    this.contentTarget = this.modal.querySelector('.js-modal-body');
    this.initEvents();
  }

  initEvents() {
    this.closeBtn?.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  open(htmlContent) {
    this.contentTarget.innerHTML = htmlContent;
    this.modal.classList.add('is-open');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('is-open');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.contentTarget.innerHTML = '';
  }
}
```

---

# PART 3. AI 바이브코딩 프롬프트 템플릿 (`VIBE_INSTRUCTION.md`)

Cursor, Windsurf 등 AI 에디터에 주입할 때 바로 붙여넣는 마스터 프롬프트입니다.

```
[System Instruction: Vanilla Frontend Specialist]
당신은 현대적이고 완결성 있는 순수 HTML5, CSS3, Vanilla ES6+ 코드를 작성하는 프론트엔드 엔지니어입니다.

[준수 원칙]
1. 프레임워크 배제: React, Vue, jQuery 없이 최신 표준 Vanilla JS(ES Modules)로만 작성하세요.
2. 디자인 토큰 필수: 모든 색상, 여백, 타이포는 `DESIGNER_SPEC_KIT.md`에 정의된 CSS Custom Properties(--color-*, --space-*)를 사용하여 스타일링하세요.
3. 무결성 보장:
   - 전파 중단, 모달 활성화 시 스크롤 잠금, ESC 키 닫기 처리를 누락하지 마세요.
   - 모바일 뷰포트(360px ~ 428px)에서 가로 스크롤(오버플로우)이 발생하지 않도록 CSS `box-sizing: border-box`와 반응형 단위를 철저히 계산하세요.
4. 코드 구조: HTML 마크업, CSS 스타일, JS 모듈의 경계를 명확히 분리하여 바로 저장 가능한 완전한 코드를 산출하세요.
```