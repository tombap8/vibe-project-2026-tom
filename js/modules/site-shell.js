import { initAuthControls } from './auth-controls.js';
import { initFooter } from './footer.js';

const appRoot = new URL('../../', import.meta.url);

async function loadPartial(path) {
  const response = await fetch(new URL(path, appRoot));
  if (!response.ok) {
    throw new Error(`공통 레이아웃을 불러오지 못했습니다: ${path} (${response.status})`);
  }

  const template = document.createElement('template');
  template.innerHTML = await response.text();
  template.content.querySelectorAll('[href], [src]').forEach((element) => {
    for (const attribute of ['href', 'src']) {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, new URL(value, appRoot).href);
    }
  });
  return template.content;
}

async function renderSlot(selector, path) {
  const slot = document.querySelector(selector);
  if (!slot) return;
  slot.replaceWith(await loadPartial(path));
}

async function initSiteShell() {
  await Promise.all([
    renderSlot('[data-site-header-slot]', 'partials/header.html'),
    renderSlot('[data-site-footer]', 'partials/footer.html'),
  ]);
  initAuthControls();
  initFooter();
}

export const siteShellReady = initSiteShell();
