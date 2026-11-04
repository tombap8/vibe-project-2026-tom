const menuImages = [
  "discovery-mob-11.png",
  "discovery-mob-15.png",
  "discovery-mob-17.png",
  "discovery-mob-19.png",
  "discovery-mob-20.png",
  "discovery-mob-22.png",
  "discovery-mob-30.png",
  "discovery-mob-32.png",
  "discovery-mob-56.png",
];

const menuCategories = {
  여성: [
    { title: "여성", items: ["닝닝PICK", "BEST", "NEW"] },
    { title: "다운", items: ["경량다운", "숏다운", "미드다운", "롱다운", "다운베스트"] },
    { title: "아우터", items: ["바람막이", "자켓", "플리스", "경량패딩", "경량자켓", "아노락", "베스트"] },
    { title: "상의", items: ["긴팔티", "맨투맨", "후드티", "반팔티", "카라티", "원피스", "브라탑"] },
    { title: "하의", items: ["롱팬츠", "카고/조거", "숏팬츠", "스커트", "레깅스"] },
    { title: "트레이닝 셋업", items: ["트레이닝 상의", "트레이닝 하의"] },
  ],
  남성: [
    { title: "남성", items: ["BEST", "NEW", "다운", "아우터", "상의", "하의"] },
    { title: "다운", items: ["경량다운", "숏다운", "미드다운", "롱다운", "다운베스트"] },
    { title: "아우터", items: ["바람막이", "자켓", "플리스", "경량패딩", "경량자켓", "아노락", "베스트"] },
    { title: "상의", items: ["긴팔티", "맨투맨", "후드티", "반팔티", "카라티"] },
    { title: "하의", items: ["롱팬츠", "카고/조거", "숏팬츠", "트레이닝 하의"] },
    { title: "트레이닝 셋업", items: ["트레이닝 상의", "트레이닝 하의"] },
  ],
  신발: [
    { title: "신발", items: ["BEST", "NEW", "트레킹화", "운동화", "샌들", "부츠"] },
    { title: "아웃도어", items: ["트레킹화", "하이킹화", "워킹화", "등산화"] },
    { title: "데일리", items: ["운동화", "슬립온", "샌들", "슬리퍼"] },
    { title: "시즌 슈즈", items: ["윈터부츠", "패딩슈즈", "방한화"] },
  ],
  용품: [
    { title: "용품", items: ["BEST", "NEW", "모자", "가방", "양말", "장갑"] },
    { title: "가방", items: ["백팩", "크로스백", "숄더백", "힙색"] },
    { title: "모자", items: ["볼캡", "버킷햇", "비니", "캡"] },
    { title: "액세서리", items: ["양말", "장갑", "벨트", "기타용품"] },
  ],
  키즈: [
    { title: "키즈", items: ["BEST", "NEW", "다운", "아우터", "상의", "하의"] },
    { title: "다운", items: ["경량다운", "숏다운", "롱다운", "다운베스트"] },
    { title: "아우터", items: ["바람막이", "자켓", "플리스", "경량패딩"] },
    { title: "의류", items: ["맨투맨", "후드티", "반팔티", "팬츠", "레깅스"] },
    { title: "신발·용품", items: ["운동화", "모자", "가방", "양말"] },
  ],
  아울렛: [
    { title: "아울렛", items: ["여성", "남성", "키즈", "신발", "용품"] },
    { title: "여성 아울렛", items: ["다운", "아우터", "상의", "하의"] },
    { title: "남성 아울렛", items: ["다운", "아우터", "상의", "하의"] },
    { title: "키즈·신발", items: ["키즈 의류", "운동화", "트레킹화", "용품"] },
  ],
};

const menu = document.querySelector(".full-menu");
const menuContent = document.querySelector(".full-menu__content");
const menuTabs = [...document.querySelectorAll(".full-menu__tab")];
const menuClose = document.querySelector(".full-menu__close");
const desktopMenuTrigger = document.querySelector(".icon-button--menu");
const mobileMenuTrigger = document.querySelector(".tabbar__item--category");
const mobileMenuLabel = mobileMenuTrigger.querySelector("span");
const pageHeader = document.querySelector(".outer-box--header");
const pageMain = document.querySelector("main");
const floatingActions = document.querySelector(".floating-actions");
const tabbar = document.querySelector(".tabbar");
const paginationNav = document.querySelector(".hero__pagination");
const mobileViewport = window.matchMedia("(max-width: 768px)");

const searchModal = document.querySelector(".search-modal");
const desktopSearchTrigger = document.querySelector(".icon-button--search");
const mobileSearchTrigger = document.querySelector(".tabbar__item--search");
const searchCloseButton = document.querySelector(".search-modal__close");
const searchInput = document.querySelector(".search-modal__input");
const searchTabs = [...document.querySelectorAll(".search-modal__tab")];
const searchTagRemoveButtons = [...document.querySelectorAll(".search-modal__tag-remove")];
const searchClearAllButton = document.querySelector(".search-modal__clear-all");

let menuOpener = null;
let searchOpener = null;
let closeTimer = 0;
let openTimer = 0;
let searchCloseTimer = 0;

function createMenuItem(label, index) {
  const link = document.createElement("a");
  link.className = "full-menu__item";
  link.href = "#hero";

  const image = document.createElement("img");
  image.className = "full-menu__item-image";
  image.src = `./images/menu/${menuImages[index % menuImages.length]}`;
  image.alt = "";
  image.loading = "lazy";

  const itemLabel = document.createElement("span");
  itemLabel.className = "full-menu__item-label";
  itemLabel.textContent = label;

  link.setAttribute("aria-label", `${label} 메뉴`);
  link.append(image, itemLabel);
  return link;
}

function createMenuSection(section, sectionIndex) {
  const sectionElement = document.createElement("section");
  sectionElement.className = "full-menu__section";

  const heading = document.createElement("h3");
  heading.className = "full-menu__section-heading";

  const title = document.createElement("span");
  title.textContent = section.title;

  const viewAll = document.createElement("a");
  viewAll.className = "full-menu__view-all";
  viewAll.href = "#hero";
  viewAll.setAttribute("aria-label", `${section.title} 전체보기`);
  viewAll.append(document.createTextNode("전체보기"));

  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrow.setAttribute("viewBox", "0 0 24 24");
  arrow.setAttribute("aria-hidden", "true");
  const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrowPath.setAttribute("d", "m9 5 7 7-7 7");
  arrow.append(arrowPath);
  viewAll.append(arrow);
  heading.append(title, viewAll);

  const items = document.createElement("div");
  items.className = "full-menu__items";
  section.items.forEach((label, itemIndex) => {
    items.append(createMenuItem(label, sectionIndex + itemIndex));
  });

  sectionElement.append(heading, items);
  return sectionElement;
}

function renderMenu(category) {
  const sections = menuCategories[category];
  const sectionList = document.createElement("div");
  sectionList.className = "full-menu__sections";
  sections.forEach((section, index) => {
    sectionList.append(createMenuSection(section, index));
  });

  const content = [sectionList];
  if (category === "여성") {
    const features = document.createElement("div");
    features.className = "full-menu__features";
    ["프로모션", "트렌드", "RE MARKET"].forEach((label, index) => {
      const feature = document.createElement("a");
      feature.className = "full-menu__feature";
      feature.href = "#hero";
      feature.setAttribute("aria-label", `${label} 메뉴`);

      const image = document.createElement("img");
      image.className = "full-menu__feature-image";
      image.src = `./images/menu/${menuImages[index]}`;
      image.alt = "";
      image.loading = "lazy";

      const featureLabel = document.createElement("span");
      featureLabel.textContent = label;
      feature.append(image, featureLabel);
      features.append(feature);
    });
    content.push(features);
  }

  menuContent.replaceChildren(...content);
  const activeTab = menuTabs.find((tab) => tab.dataset.category === category);
  menuContent.setAttribute("aria-labelledby", activeTab.id);
  menuContent.scrollTop = 0;
}

function selectMenuTab(tab, moveFocus = false) {
  menuTabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle("full-menu__tab--active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });
  renderMenu(tab.dataset.category);
  if (moveFocus) tab.focus();
}

function setBackgroundInert(isInert) {
  pageHeader.inert = isInert;
  pageMain.inert = isInert;
  floatingActions.inert = isInert;
  if (paginationNav) paginationNav.inert = isInert;
  tabbar.inert = !mobileViewport.matches;
  tabbar.querySelectorAll(":scope > :not(.tabbar__item--category)").forEach((item) => {
    item.inert = isInert;
  });
}

function openMenu(opener) {
  window.clearTimeout(closeTimer);
  window.clearTimeout(openTimer);
  menuOpener = opener;
  menu.hidden = false;
  menu.inert = false;
  menu.setAttribute("aria-hidden", "false");
  menu.dataset.state = "opening";
  document.documentElement.classList.add("menu-open");
  document.body.classList.add("menu-open");
  setBackgroundInert(true);
  desktopMenuTrigger.setAttribute("aria-expanded", "true");
  mobileMenuTrigger.setAttribute("aria-expanded", "true");
  mobileMenuTrigger.setAttribute("aria-label", "닫기");
  mobileMenuLabel.textContent = "닫기";
  const revealMenu = () => {
    if (menu.dataset.state !== "opening") return;
    window.clearTimeout(openTimer);
    menu.dataset.state = "open";
    const activeTab = menuTabs.find((tab) => tab.getAttribute("aria-selected") === "true");
    (mobileViewport.matches ? activeTab : menuClose).focus();
  };
  window.requestAnimationFrame(revealMenu);
  openTimer = window.setTimeout(revealMenu, 50);
}

function finishClose() {
  if (menu.dataset.state !== "closed") return;
  menu.hidden = true;
  document.documentElement.classList.remove("menu-open");
  document.body.classList.remove("menu-open");
  setBackgroundInert(false);
  const restoreTarget = menuOpener?.getClientRects().length
    ? menuOpener
    : mobileViewport.matches
      ? mobileMenuTrigger
      : desktopMenuTrigger;
  restoreTarget.focus();
  menuOpener = null;
}

function closeMenu() {
  if (menu.hidden || menu.dataset.state === "closed") return;
  window.clearTimeout(openTimer);
  menu.dataset.state = "closed";
  menu.inert = true;
  menu.setAttribute("aria-hidden", "true");
  desktopMenuTrigger.setAttribute("aria-expanded", "false");
  mobileMenuTrigger.setAttribute("aria-expanded", "false");
  mobileMenuTrigger.setAttribute("aria-label", "카테고리");
  mobileMenuLabel.textContent = "카테고리";

  window.clearTimeout(closeTimer);
  closeTimer = window.setTimeout(finishClose, mobileViewport.matches ? 400 : 250);
}

menuTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectMenuTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % menuTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + menuTabs.length) % menuTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = menuTabs.length - 1;
    else return;

    event.preventDefault();
    selectMenuTab(menuTabs[nextIndex], true);
  });
});

desktopMenuTrigger.addEventListener("click", () => openMenu(desktopMenuTrigger));
mobileMenuTrigger.addEventListener("click", () => {
  if (menu.hidden || menu.dataset.state === "closed") openMenu(mobileMenuTrigger);
  else closeMenu();
});
menuClose.addEventListener("click", closeMenu);
menu.addEventListener("click", (event) => {
  if (event.target.closest(".full-menu__item, .full-menu__view-all, .full-menu__feature")) closeMenu();
});
menu.addEventListener("transitionend", (event) => {
  if (
    event.target === menu &&
    ((mobileViewport.matches && event.propertyName === "transform") ||
      (!mobileViewport.matches && event.propertyName === "opacity"))
  ) {
    window.clearTimeout(closeTimer);
    finishClose();
  }
});

selectMenuTab(menuTabs[0]);

/* --- 검색 모달 (Fixed) 상호작용 제어 --- */
function initSearchModal() {
  if (!searchModal) return;

  function setSearchInert(isInert) {
    pageHeader.inert = isInert;
    pageMain.inert = isInert;
    floatingActions.inert = isInert;
    if (paginationNav) paginationNav.inert = isInert;
    if (tabbar) tabbar.inert = isInert;
  }

  function openSearch(opener) {
    if (menu.dataset.state === "open") closeMenu();
    searchOpener = opener;
    searchModal.hidden = false;
    searchModal.inert = false;
    searchModal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    setSearchInert(true);

    if (desktopSearchTrigger) desktopSearchTrigger.setAttribute("aria-expanded", "true");
    if (mobileSearchTrigger) mobileSearchTrigger.setAttribute("aria-expanded", "true");

    window.requestAnimationFrame(() => {
      searchModal.dataset.state = "open";
      if (searchInput) searchInput.focus();
    });
  }

  function closeSearch() {
    if (searchModal.hidden || searchModal.dataset.state === "closed") return;
    searchModal.dataset.state = "closed";
    searchModal.inert = true;
    searchModal.setAttribute("aria-hidden", "true");

    if (desktopSearchTrigger) desktopSearchTrigger.setAttribute("aria-expanded", "false");
    if (mobileSearchTrigger) mobileSearchTrigger.setAttribute("aria-expanded", "false");

    window.clearTimeout(searchCloseTimer);
    searchCloseTimer = window.setTimeout(() => {
      searchModal.hidden = true;
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      setSearchInert(false);

      if (searchOpener && typeof searchOpener.focus === "function") {
        searchOpener.focus();
      }
      searchOpener = null;
    }, 200);
  }

  if (desktopSearchTrigger) {
    desktopSearchTrigger.addEventListener("click", () => openSearch(desktopSearchTrigger));
  }
  if (mobileSearchTrigger) {
    mobileSearchTrigger.addEventListener("click", () => openSearch(mobileSearchTrigger));
  }
  if (searchCloseButton) {
    searchCloseButton.addEventListener("click", closeSearch);
  }

  // 탭 클릭 전환
  searchTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      searchTabs.forEach((t) => {
        const isCurrent = t === tab;
        t.classList.toggle("search-modal__tab--active", isCurrent);
        t.setAttribute("aria-selected", String(isCurrent));
      });
    });
  });

  // 검색 태그 개별 삭제
  searchTagRemoveButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tag = e.target.closest(".search-modal__tag");
      if (tag) tag.remove();
    });
  });

  // 최근 검색어 전체 삭제
  if (searchClearAllButton) {
    searchClearAllButton.addEventListener("click", () => {
      const tagsContainer = searchModal.querySelector(".search-modal__tags");
      if (tagsContainer) tagsContainer.innerHTML = "";
    });
  }

  // Escape 닫기 및 탭 트랩
  document.addEventListener("keydown", (event) => {
    if (searchModal.hidden || searchModal.dataset.state !== "open") return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      return;
    }

    if (event.key === "Tab") {
      const focusable = [
        ...searchModal.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ].filter((el) => el.getClientRects().length > 0);

      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

initSearchModal();

/* --- 히어로 섹션 풀페이지 스크롤 & 일반 스크롤 전환 제어 --- */
function initFullPageScroll() {
  const heroSections = [...document.querySelectorAll(".hero")];
  const shortsSection = document.querySelector(".section-shorts");
  const paginationNav = document.querySelector(".hero__pagination");
  const paginationItems = [...document.querySelectorAll(".hero__pagination-item")];

  if (heroSections.length === 0) return;

  let currentHeroIndex = 0;
  let isScrolling = false;
  let scrollEndTimer = null;
  let isHeroSnapActive = true;

  // 히어로 자동 스냅 활성화
  function enableHeroSnap() {
    if (isHeroSnapActive) return;
    isHeroSnapActive = true;
    document.documentElement.style.scrollSnapType = "y mandatory";
    if (paginationNav) {
      paginationNav.style.opacity = "";
      paginationNav.style.pointerEvents = "";
    }
  }

  // 일반 스크롤 모드로 전환 (스냅 해제)
  function disableHeroSnap() {
    if (!isHeroSnapActive) return;
    isHeroSnapActive = false;
    document.documentElement.style.scrollSnapType = "none";
    if (paginationNav) {
      paginationNav.style.opacity = "0";
      paginationNav.style.pointerEvents = "none";
    }
  }

  function updatePagination(index) {
    if (index < 0 || index >= heroSections.length) {
      disableHeroSnap();
      return;
    }
    enableHeroSnap();
    currentHeroIndex = index;
    paginationItems.forEach((item, idx) => {
      const isActive = idx === index;
      item.classList.toggle("hero__pagination-item--active", isActive);
      item.setAttribute("aria-current", String(isActive));
    });
  }

  function scrollToSection(index) {
    if (index < 0 || index >= heroSections.length) return;
    const targetSection = heroSections[index];
    if (!targetSection) return;

    isScrolling = true;
    enableHeroSnap();
    updatePagination(index);
    targetSection.scrollIntoView({ behavior: "smooth" });

    window.clearTimeout(scrollEndTimer);
    scrollEndTimer = window.setTimeout(() => {
      isScrolling = false;
    }, 700);
  }

  // 세번째 페이지 하단(일반 스크롤 영역)으로 부드럽게 이동
  function scrollToNormalContent() {
    if (!shortsSection) return;
    isScrolling = true;
    disableHeroSnap();
    shortsSection.scrollIntoView({ behavior: "smooth" });

    window.clearTimeout(scrollEndTimer);
    scrollEndTimer = window.setTimeout(() => {
      isScrolling = false;
    }, 700);
  }

  // IntersectionObserver로 히어로 슬라이드 감지
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const index = heroSections.indexOf(entry.target);
          if (index !== -1) {
            updatePagination(index);
          }
        }
      });
    },
    {
      root: null,
      threshold: [0.5, 0.7],
    }
  );
  heroSections.forEach((section) => heroObserver.observe(section));

  // 스크롤 위치 기반 실시간 모드 감지 (스크롤바 직접 드래그 등 대응)
  window.addEventListener(
    "scroll",
    () => {
      if (isScrolling) return;

      const currentY = window.scrollY || window.pageYOffset;
      const hero3 = heroSections[heroSections.length - 1];
      if (!hero3) return;

      const heroBoundary = hero3.offsetTop + hero3.offsetHeight * 0.7;

      if (currentY >= heroBoundary) {
        disableHeroSnap();
      } else {
        enableHeroSnap();
      }
    },
    { passive: true }
  );

  paginationItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      scrollToSection(index);
    });
  });

  window.addEventListener(
    "wheel",
    (event) => {
      if (menu.dataset.state === "open" || menu.dataset.state === "opening") return;
      if (searchModal && searchModal.dataset.state === "open") return;

      if (isScrolling) {
        event.preventDefault();
        return;
      }

      const delta = event.deltaY;
      if (Math.abs(delta) < 15) return;

      const currentY = window.scrollY || window.pageYOffset;
      const hero3 = heroSections[heroSections.length - 1];
      const hero3Top = hero3 ? hero3.offsetTop : 0;
      const shortsTop = shortsSection ? shortsSection.offsetTop : hero3Top + window.innerHeight;

      // 1. 세번째 페이지 하단(일반 스크롤 영역)에 있는 경우
      if (currentY >= shortsTop - 20) {
        // 일반 스크롤 영역 최상단에서 위로 휠을 올렸을 때 -> 세번째 페이지로 자동 복귀!
        if (delta < 0 && currentY <= shortsTop + 10) {
          event.preventDefault();
          scrollToSection(heroSections.length - 1);
        }
        // 그 외에는 브라우저 기본의 자연스러운 일반 스크롤 허용!
        return;
      }

      // 2. 히어로 1~3페이지(자동 스크롤 영역)에 있는 경우
      if (delta > 0) {
        // 아래로 이동
        if (currentHeroIndex < heroSections.length - 1) {
          event.preventDefault();
          scrollToSection(currentHeroIndex + 1);
        } else if (currentHeroIndex === heroSections.length - 1) {
          // 세번째 페이지에서 아래로 휠 다운 -> 세번째 페이지 하단 일반 스크롤 영역으로 진입!
          event.preventDefault();
          scrollToNormalContent();
        }
      } else if (delta < 0) {
        // 위로 이동
        if (currentHeroIndex > 0) {
          event.preventDefault();
          scrollToSection(currentHeroIndex - 1);
        }
      }
    },
    { passive: false }
  );

  window.addEventListener("keydown", (event) => {
    if (menu.dataset.state === "open" || menu.dataset.state === "opening") return;
    if (searchModal && searchModal.dataset.state === "open") return;
    if (document.activeElement?.closest("input, textarea, select")) return;

    const currentY = window.scrollY || window.pageYOffset;
    const hero3 = heroSections[heroSections.length - 1];
    const shortsTop = shortsSection ? shortsSection.offsetTop : (hero3 ? hero3.offsetTop + window.innerHeight : 0);

    if (currentY >= shortsTop - 20) {
      if ((event.key === "ArrowUp" || event.key === "PageUp") && currentY <= shortsTop + 10) {
        event.preventDefault();
        scrollToSection(heroSections.length - 1);
      }
      return;
    }

    if (event.key === "ArrowDown" || event.key === "PageDown") {
      if (currentHeroIndex < heroSections.length - 1) {
        event.preventDefault();
        scrollToSection(currentHeroIndex + 1);
      } else if (currentHeroIndex === heroSections.length - 1 && shortsSection) {
        event.preventDefault();
        scrollToNormalContent();
      }
    } else if (event.key === "ArrowUp" || event.key === "PageUp") {
      if (currentHeroIndex > 0) {
        event.preventDefault();
        scrollToSection(currentHeroIndex - 1);
      }
    } else if (event.key === "Home") {
      event.preventDefault();
      scrollToSection(0);
    } else if (event.key === "End") {
      event.preventDefault();
      if (shortsSection) {
        scrollToNormalContent();
      } else {
        scrollToSection(heroSections.length - 1);
      }
    }
  });

  window.addEventListener("scrollend", () => {
    isScrolling = false;
  });

  // 초기 로드 시 현재 스크롤 위치에 맞춰 스냅/일반 스크롤 모드 설정
  const initialY = window.scrollY || window.pageYOffset;
  const hero3 = heroSections[heroSections.length - 1];
  const shortsTop = shortsSection ? shortsSection.offsetTop : (hero3 ? hero3.offsetTop + window.innerHeight : 0);
  if (initialY >= shortsTop - 30) {
    disableHeroSnap();
  } else {
    enableHeroSnap();
  }
}

initFullPageScroll();

/* --- 디스커버리 숏츠 데이터 동적 연동 및 렌더링 --- */
async function initShortsSection() {
  const shortsContainer = document.querySelector(".section-shorts");
  if (!shortsContainer) return;

  const titleElement = shortsContainer.querySelector("#shorts-title");
  const listElement = shortsContainer.querySelector(".shorts__list");
  if (!listElement) return;

  try {
    const response = await fetch("./data/yt-shorts.json");
    if (!response.ok) return;

    const data = await response.json();
    if (!data || !Array.isArray(data.items)) return;

    if (titleElement && data.section_title) {
      titleElement.textContent = data.section_title;
    }

    listElement.innerHTML = data.items
      .map((item, index) => {
        const product = item.product || {};
        const formattedPrice = typeof product.price === "number" ? product.price.toLocaleString("ko-KR") : product.price || "";

        return `
          <article class="shorts-card" data-video-url="${item.video_url || ""}">
            <div class="shorts-card__video-wrap">
              <img class="shorts-card__thumbnail" src="${item.thumbnail_url}" alt="${item.title} 숏츠 영상" loading="lazy">
              <div class="shorts-card__badges">
                <span class="shorts-card__play" aria-hidden="true">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                    <path d="M1 1.5l8 4.5-8 4.5V1.5z"></path>
                  </svg>
                </span>
                <span class="shorts-card__views">
                  <svg class="shorts-card__views-icon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"></path>
                  </svg>
                  ${item.view_count ?? ""}
                </span>
              </div>
              <div class="shorts-card__caption">
                <strong class="shorts-card__caption-title">${item.title}</strong>
              </div>
            </div>
            <a class="shorts-card__product" href="#hero" aria-label="${product.name || "상품"} 상세 보기">
              <div class="shorts-card__product-image">
                <img src="${product.thumbnail_url || ""}" alt="" loading="lazy">
              </div>
              <div class="shorts-card__product-info">
                <span class="shorts-card__product-name">${product.name || ""}</span>
                <strong class="shorts-card__product-price">${formattedPrice}</strong>
              </div>
            </a>
          </article>
        `;
      })
      .join("");
  } catch (err) {
    // 정적 마크업 폴백 유지
  }
}

initShortsSection();
