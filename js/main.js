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
const mobileViewport = window.matchMedia("(max-width: 768px)");
let menuOpener = null;
let closeTimer = 0;
let openTimer = 0;

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
document.addEventListener("keydown", (event) => {
  if (menu.hidden || menu.dataset.state === "closed") return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
    return;
  }

  if (menu.dataset.state !== "open" || event.key !== "Tab") return;
  const focusable = [
    ...menu.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'),
    ...(mobileViewport.matches ? [mobileMenuTrigger] : []),
  ].filter((element) => element.getClientRects().length > 0);
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
});
mobileViewport.addEventListener("change", () => {
  if (menu.hidden) return;
  setBackgroundInert(true);
  const label = mobileViewport.matches ? "닫기" : "카테고리";
  mobileMenuTrigger.setAttribute("aria-label", label);
  mobileMenuLabel.textContent = label;
});

selectMenuTab(menuTabs[0]);

/* --- 히어로 섹션 풀페이지 스크롤 & 인디케이터 제어 --- */
function initFullPageScroll() {
  const heroSections = [...document.querySelectorAll(".hero")];
  const paginationItems = [...document.querySelectorAll(".hero__pagination-item")];

  if (heroSections.length === 0) return;

  let currentHeroIndex = 0;
  let isScrolling = false;
  let scrollEndTimer = null;

  function updatePagination(index) {
    if (index < 0 || index >= heroSections.length) return;
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
    updatePagination(index);
    targetSection.scrollIntoView({ behavior: "smooth" });

    window.clearTimeout(scrollEndTimer);
    scrollEndTimer = window.setTimeout(() => {
      isScrolling = false;
    }, 700);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = heroSections.indexOf(entry.target);
          if (index !== -1) {
            updatePagination(index);
          }
        }
      });
    },
    {
      root: null,
      threshold: 0.5,
    }
  );

  heroSections.forEach((section) => observer.observe(section));

  paginationItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      scrollToSection(index);
    });
  });

  window.addEventListener(
    "wheel",
    (event) => {
      if (menu.dataset.state === "open" || menu.dataset.state === "opening") return;

      if (isScrolling) {
        event.preventDefault();
        return;
      }

      const delta = event.deltaY;
      if (Math.abs(delta) < 20) return;

      if (delta > 0 && currentHeroIndex < heroSections.length - 1) {
        event.preventDefault();
        scrollToSection(currentHeroIndex + 1);
      } else if (delta < 0 && currentHeroIndex > 0) {
        event.preventDefault();
        scrollToSection(currentHeroIndex - 1);
      }
    },
    { passive: false }
  );

  window.addEventListener("keydown", (event) => {
    if (menu.dataset.state === "open" || menu.dataset.state === "opening") return;
    if (document.activeElement?.closest("input, textarea, select")) return;

    if (event.key === "ArrowDown" || event.key === "PageDown") {
      if (currentHeroIndex < heroSections.length - 1) {
        event.preventDefault();
        scrollToSection(currentHeroIndex + 1);
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
      scrollToSection(heroSections.length - 1);
    }
  });

  window.addEventListener("scrollend", () => {
    isScrolling = false;
  });
}

initFullPageScroll();
