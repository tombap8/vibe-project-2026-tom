import { getCurrentAuthSession } from '../services/auth-service.js';
import { qnaRepository } from '../services/qna-repository.js';
import { siteShellReady } from './site-shell.js';

await siteShellReady;

const PAGE_SIZE = 7;
const MAX_CONTENT_LENGTH = 5000;
const QUESTION_TYPES = ['배송문의', '계정문의', '교환/환불', '시스템오류', '기타'];
const view = document.querySelector('[data-js="qna-view"]');
const pageTitle = document.querySelector('[data-js="page-title"]');
const pageDescription = document.querySelector('[data-js="page-description"]');
const breadcrumbCurrent = document.querySelector('[data-js="breadcrumb-current"]');
let currentUser = null;
let currentUserIsAdmin = false;
let boardInitialized = false;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function routeUrl(parameters = {}) {
  const url = new URL('./qna.html', window.location.href);
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });
  return url.href;
}

function renderError(message) {
  view.innerHTML = `<p class="notice-status" role="alert">${escapeHtml(message)}</p><p class="notice-actions"><a class="notice-button" href="./qna.html">목록으로</a></p>`;
}

function renderList(questions, parameters) {
  const type = parameters.get('type') || 'all';
  const search = parameters.get('q') || '';
  const requestedPage = Math.max(1, Number(parameters.get('page')) || 1);
  const normalizedSearch = search.trim().toLocaleLowerCase('ko-KR');
  const filtered = questions.filter((question) => {
    const matchesType = type === 'all' || question.type === type;
    const matchesSearch = !normalizedSearch
      || `${question.title} ${question.content}`.toLocaleLowerCase('ko-KR').includes(normalizedSearch);
    return matchesType && matchesSearch;
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);
  const pageQuestions = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rows = pageQuestions.map((question, index) => {
    const canRead = !question.isPrivate || currentUserIsAdmin || question.authorId === currentUser?.uid;
    const number = filtered.length - (page - 1) * PAGE_SIZE - index;
    const title = canRead
      ? `<a href="${routeUrl({ view: 'detail', id: question.id })}">${escapeHtml(question.title)}</a>`
      : `<span>${escapeHtml(question.title)}</span>`;
    return `<tr>
      <td class="notice-table__number">${question.answer ? '<span class="qna-status">답변완료</span>' : number}</td>
      <td class="notice-table__title qna-list__title">
        ${title}
        ${question.isPrivate ? '<span class="qna-private">비공개</span>' : ''}
      </td>
      <td class="notice-table__date" data-label="질문유형">${escapeHtml(question.type)}</td>
      <td class="notice-table__views" data-label="등록일">${formatDate(question.createdAt)}</td>
    </tr>`;
  }).join('');
  const pages = Array.from({ length: pageCount }, (_, index) => {
    const number = index + 1;
    return `<button type="button" data-page="${number}" ${number === page ? 'aria-current="page"' : ''}>${number}</button>`;
  }).join('');

  pageTitle.textContent = '묻고답하기';
  pageDescription.textContent = '궁금한 점을 남겨 주시면 확인 후 답변해 드립니다.';
  breadcrumbCurrent.textContent = '';
  view.innerHTML = `
    <div class="notice-list">
      <div class="notice-list__toolbar">
        <p class="notice-list__count">총 <strong>${filtered.length.toLocaleString('ko-KR')}</strong>건</p>
        <form class="notice-list__filters" data-js="search-form">
          <label class="visually-hidden" for="qna-type-filter">질문 유형</label>
          <select class="notice-select" id="qna-type-filter" name="type">
            <option value="all" ${type === 'all' ? 'selected' : ''}>전체 유형</option>
            ${QUESTION_TYPES.map((item) => `<option value="${escapeHtml(item)}" ${type === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}
          </select>
          <label class="notice-search">
            <span class="visually-hidden">검색어</span>
            <input class="notice-search__input" type="search" name="q" value="${escapeHtml(search)}" placeholder="검색어를 입력하세요.">
            <button class="notice-search__button" type="submit" aria-label="검색">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg>
            </button>
          </label>
          ${currentUser ? `<a class="notice-button notice-button--primary" href="${routeUrl({ view: 'write' })}"><span aria-hidden="true">✎</span> 질문하기</a>` : ''}
        </form>
      </div>
      ${pageQuestions.length ? `<div class="notice-table-wrap">
        <table class="notice-table qna-table">
          <caption class="visually-hidden">묻고답하기 질문 목록</caption>
          <thead><tr><th class="notice-table__number" scope="col">상태</th><th class="notice-table__title" scope="col">제목</th><th class="notice-table__date" scope="col">질문유형</th><th class="notice-table__views" scope="col">등록일</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>` : '<p class="notice-empty">등록된 질문이 없습니다.</p>'}
      <nav class="notice-pagination" aria-label="묻고답하기 페이지">
        <button type="button" data-page="${Math.max(1, page - 1)}" aria-label="이전 페이지" ${page === 1 ? 'disabled' : ''}>‹</button>
        ${pages}
        <button type="button" data-page="${Math.min(pageCount, page + 1)}" aria-label="다음 페이지" ${page === pageCount ? 'disabled' : ''}>›</button>
      </nav>
    </div>`;

  view.querySelector('[data-js="search-form"]').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    window.location.assign(routeUrl({
      type: data.get('type') === 'all' ? '' : data.get('type'),
      q: data.get('q'),
    }));
  });
  view.querySelector('.notice-pagination').addEventListener('click', (event) => {
    const button = event.target.closest('[data-page]');
    if (button && !button.disabled) {
      window.location.assign(routeUrl({ type: type === 'all' ? '' : type, q: search, page: button.dataset.page }));
    }
  });
}

function renderDetail(question) {
  pageTitle.textContent = '묻고답하기';
  pageDescription.textContent = '궁금한 점을 남겨 주시면 확인 후 답변해 드립니다.';
  breadcrumbCurrent.textContent = '질문 상세';
  const isOwner = question.authorId === currentUser?.uid;
  const actions = [
    '<a class="notice-button" href="./qna.html">목록으로</a>',
    ...(isOwner ? [
      `<a class="notice-button" href="${routeUrl({ view: 'edit', id: question.id })}">수정</a>`,
      `<button class="notice-button" type="button" data-delete="${escapeHtml(question.id)}">삭제</button>`,
    ] : []),
  ].join('');
  view.innerHTML = `
    <article class="notice-detail">
      <div class="notice-detail__card">
        <header class="notice-detail__header">
          <div class="notice-detail__title">
            <span class="notice-badge">${escapeHtml(question.type)}</span>
            ${question.isPrivate ? '<span class="qna-private">비공개</span>' : ''}
            <h2>${escapeHtml(question.title)}</h2>
          </div>
          <div class="notice-detail__meta">
            <span>등록일 <time datetime="${escapeHtml(question.createdAt)}">${formatDate(question.createdAt)}</time></span>
            ${question.updatedAt !== question.createdAt ? `<span>수정일 ${formatDate(question.updatedAt)}</span>` : ''}
          </div>
        </header>
        <div class="notice-detail__content qna-content">${escapeHtml(question.content)}</div>
      </div>
      ${question.answer ? `<section class="notice-detail__card qna-answer" aria-labelledby="qna-answer-title">
        <h2 id="qna-answer-title">답변</h2>
        <p class="notice-detail__meta">답변일 ${formatDate(question.answeredAt)}</p>
        <div class="notice-detail__content qna-content">${escapeHtml(question.answer)}</div>
      </section>` : ''}
      ${currentUserIsAdmin ? `<form class="qna-answer-form" data-js="answer-form">
        <label for="qna-answer-input">관리자 답변</label>
        <textarea class="notice-form__input" id="qna-answer-input" name="answer" maxlength="${MAX_CONTENT_LENGTH}" required placeholder="질문에 대한 답변을 입력해 주세요.">${escapeHtml(question.answer || '')}</textarea>
        <p class="notice-form__error" data-js="form-error" role="alert" hidden></p>
        <button class="notice-button notice-button--primary" type="submit">${question.answer ? '답변 수정' : '답변 등록'}</button>
      </form>` : ''}
      <div class="notice-detail__actions">${actions}</div>
    </article>`;

  view.querySelector('[data-js="answer-form"]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const answer = form.elements.answer.value.trim();
    const error = form.querySelector('[data-js="form-error"]');
    if (!answer) {
      error.textContent = '답변을 입력해 주세요.';
      error.hidden = false;
      return;
    }
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      await qnaRepository.answer(question.id, answer);
      window.location.reload();
    } catch (reason) {
      error.textContent = reason.message || '답변을 저장하지 못했습니다.';
      error.hidden = false;
      button.disabled = false;
    }
  });
}

function renderForm(question = null) {
  const isEditing = Boolean(question);
  pageTitle.textContent = isEditing ? '질문 수정' : '질문 작성';
  pageDescription.textContent = '문의하실 내용을 작성해 주세요.';
  breadcrumbCurrent.textContent = isEditing ? '질문 수정' : '질문 작성';
  view.innerHTML = `
    <form class="notice-form qna-form" data-js="question-form" novalidate>
      <div class="notice-form__row">
        <label class="notice-form__label" for="qna-title">제목<span class="notice-form__required" aria-hidden="true">*</span></label>
        <div class="notice-form__field"><input class="notice-form__input" id="qna-title" name="title" maxlength="120" required value="${escapeHtml(question?.title ?? '')}" placeholder="제목을 입력해 주세요."></div>
      </div>
      <div class="notice-form__row">
        <label class="notice-form__label" for="qna-type">질문 유형<span class="notice-form__required" aria-hidden="true">*</span></label>
        <div class="notice-form__field">
          <select class="notice-select" id="qna-type" name="type" required>
            <option value="" disabled ${question ? '' : 'selected'}>질문 유형을 선택해 주세요.</option>
            ${QUESTION_TYPES.map((item) => `<option value="${escapeHtml(item)}" ${question?.type === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="notice-form__row">
        <label class="notice-form__label" for="qna-content">내용<span class="notice-form__required" aria-hidden="true">*</span></label>
        <div class="notice-form__field"><textarea class="notice-form__input qna-form__content" id="qna-content" name="content" maxlength="${MAX_CONTENT_LENGTH}" required placeholder="문의 내용을 입력해 주세요.">${escapeHtml(question?.content ?? '')}</textarea></div>
      </div>
      <div class="notice-form__row">
        <span class="notice-form__label">공개 설정</span>
        <div class="notice-form__field">
          <label class="notice-form__update-date"><input type="checkbox" name="isPrivate" ${question?.isPrivate ? 'checked' : ''}> 비공개 질문</label>
          <span class="notice-form__help">비공개 질문은 작성자와 관리자만 내용을 확인할 수 있습니다.</span>
        </div>
      </div>
      <p class="notice-form__error" data-js="form-error" role="alert" hidden></p>
      <div class="notice-form__actions">
        <a class="notice-button" href="./qna.html">목록으로</a>
        <button class="notice-button notice-button--primary" type="submit">${isEditing ? '수정 완료' : '질문 등록'}</button>
      </div>
    </form>`;

  view.querySelector('[data-js="question-form"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const title = form.elements.title.value.trim();
    const type = form.elements.type.value;
    const content = form.elements.content.value.trim();
    const error = form.querySelector('[data-js="form-error"]');
    if (!title) return showFormError(error, '제목을 입력해 주세요.');
    if (!QUESTION_TYPES.includes(type)) return showFormError(error, '질문 유형을 선택해 주세요.');
    if (!content) return showFormError(error, '문의 내용을 입력해 주세요.');
    if (Array.from(content).length > MAX_CONTENT_LENGTH) return showFormError(error, '내용은 5,000자 이하로 입력해 주세요.');

    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      const input = { title, type, content, isPrivate: form.elements.isPrivate.checked };
      const saved = question
        ? await qnaRepository.update(question.id, input)
        : await qnaRepository.create(input);
      window.location.assign(routeUrl({ view: 'detail', id: saved.id }));
    } catch (reason) {
      showFormError(error, reason.message || '질문을 저장하지 못했습니다.');
      button.disabled = false;
    }
  });
}

function showFormError(element, message) {
  element.textContent = message;
  element.hidden = false;
}

function redirectToLogin() {
  const url = new URL('./login.html', window.location.href);
  url.searchParams.set('returnTo', window.location.href);
  window.location.assign(url.href);
}

async function handleView(parameters, questions) {
  const mode = parameters.get('view') || 'list';
  if (mode === 'list') {
    renderList(questions, parameters);
    return;
  }
  if (mode === 'write') {
    if (!currentUser) {
      redirectToLogin();
      return;
    }
    renderForm();
    return;
  }
  if (!['detail', 'edit'].includes(mode)) {
    renderError('요청한 화면을 찾을 수 없습니다.');
    return;
  }
  const id = parameters.get('id');
  if (!id) {
    renderError('질문을 찾을 수 없습니다.');
    return;
  }
  let question;
  try {
    question = await qnaRepository.getById(id);
  } catch (error) {
    if (error.code === 'permission-denied') {
      renderError('비공개 질문입니다. 작성자와 관리자만 내용을 확인할 수 있습니다.');
      return;
    }
    throw error;
  }
  if (!question) {
    renderError('요청한 질문을 찾을 수 없습니다.');
    return;
  }
  const isOwner = question.authorId === currentUser?.uid;
  if (mode === 'edit') {
    if (!isOwner) {
      renderError('본인이 작성한 질문만 수정할 수 있습니다.');
      return;
    }
    renderForm(question);
    return;
  }
  renderDetail(question);
}

async function initializeBoard() {
  try {
    const { user, profile } = await getCurrentAuthSession();
    currentUser = user;
    currentUserIsAdmin = profile?.role === 'admin';
    const questions = await qnaRepository.getAll(user, currentUserIsAdmin);
    await handleView(new URLSearchParams(window.location.search), questions);
  } catch (error) {
    renderError(error.message || '묻고답하기를 불러오지 못했습니다.');
  } finally {
    boardInitialized = true;
  }
}

view.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  if (!window.confirm('이 질문을 삭제하시겠습니까?')) return;
  button.disabled = true;
  try {
    await qnaRepository.remove(button.dataset.delete);
    window.location.assign('./qna.html');
  } catch (error) {
    renderError(error.message || '질문을 삭제하지 못했습니다.');
  }
});

window.addEventListener('site-auth-change', (event) => {
  if (!boardInitialized) return;
  const nextUid = event.detail.user?.uid ?? null;
  const nextIsAdmin = event.detail.profile?.role === 'admin';
  if (currentUser?.uid !== nextUid || currentUserIsAdmin !== nextIsAdmin) window.location.reload();
});

initializeBoard();
