import { getAuthErrorMessage, signOutCurrentUser, subscribeAuthState } from '../services/auth-service.js';

export function initAuthControls() {
  const controls = document.querySelector('[data-js="auth-controls"]');
  if (!controls) return;

  const welcome = controls.querySelector('[data-js="auth-welcome"]');
  const login = controls.querySelector('[data-js="auth-login"]');
  const status = controls.querySelector('[data-js="auth-status"]');
  const loginUrl = new URL(login.dataset.loginUrl, new URL('../../', import.meta.url));
  let isSignedIn = false;
  const defaultDestination = window.location.pathname.endsWith('/login.html')
    ? new URL('./notice.html', window.location.href).href
    : window.location.href;
  loginUrl.searchParams.set('returnTo', defaultDestination);

  subscribeAuthState(({ user, profile, error }) => {
    isSignedIn = Boolean(user);
    welcome.hidden = !isSignedIn;
    login.setAttribute('aria-label', isSignedIn ? '로그아웃' : '로그인');
    login.title = isSignedIn ? '로그아웃' : '로그인';
    welcome.textContent = isSignedIn
      ? `${profile?.name || user.displayName || '사용자'}님 환영합니다`
      : '';
    status.textContent = error ? getAuthErrorMessage(error) : '';
    status.hidden = !error;
    window.dispatchEvent(new CustomEvent('site-auth-change', { detail: { user, profile, error } }));
  }, (error) => {
    status.textContent = getAuthErrorMessage(error);
    status.hidden = false;
  });

  login.addEventListener('click', async () => {
    if (!isSignedIn) {
      window.location.assign(loginUrl.href);
      return;
    }

    login.disabled = true;
    status.textContent = '';
    try {
      await signOutCurrentUser();
    } catch (error) {
      status.textContent = getAuthErrorMessage(error);
      status.hidden = false;
    } finally {
      login.disabled = false;
    }
  });
}
