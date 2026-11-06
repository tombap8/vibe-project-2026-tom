import { checkUsernameAvailability, getAuthErrorMessage, registerAccount, signInWithUsername } from '../services/auth-service.js';
import { siteShellReady } from './site-shell.js';

await siteShellReady;

const loginForm = document.querySelector('[data-js="login-form"]');
const signupForm = document.querySelector('[data-js="signup-form"]');
const returnTo = new URLSearchParams(window.location.search).get('returnTo');
const signupLink = document.querySelector('[data-js="signup-link"]');
const loginLink = document.querySelector('[data-js="login-link"]');

if (returnTo) {
  const destinationLink = signupLink || loginLink;
  const linkUrl = new URL(destinationLink.href);
  linkUrl.searchParams.set('returnTo', returnTo);
  destinationLink.href = linkUrl.href;
}

function redirectAfterLogin() {
  const returnTo = new URLSearchParams(window.location.search).get('returnTo');
  if (!returnTo) {
    window.location.assign('./notice.html');
    return;
  }
  const destination = new URL(returnTo, window.location.href);
  window.location.assign(destination.origin === window.location.origin ? destination.href : './notice.html');
}

if (loginForm) {
  const loginError = document.querySelector('[data-js="login-error"]');
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginError.textContent = '';
    const submitButton = loginForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    try {
      await signInWithUsername(loginForm.elements.username.value, loginForm.elements.password.value);
      redirectAfterLogin();
    } catch (error) {
      loginError.textContent = getAuthErrorMessage(error);
      submitButton.disabled = false;
    }
  });
}

if (signupForm) {
  const signupError = document.querySelector('[data-js="signup-error"]');
  const usernameInput = signupForm.elements.username;
  const usernameStatus = document.querySelector('[data-js="username-status"]');
  const checkUsernameButton = document.querySelector('[data-js="check-username"]');
  let availableUsername = '';

  checkUsernameButton.addEventListener('click', async () => {
    usernameStatus.textContent = '';
    checkUsernameButton.disabled = true;
    try {
      const username = usernameInput.value.trim();
      const available = await checkUsernameAvailability(username);
      availableUsername = available ? username.toLocaleLowerCase('en-US') : '';
      usernameStatus.textContent = available ? '사용할 수 있는 아이디입니다.' : '이미 사용 중인 아이디입니다.';
      usernameStatus.setAttribute('role', available ? 'status' : 'alert');
    } catch (error) {
      usernameStatus.textContent = getAuthErrorMessage(error);
      usernameStatus.setAttribute('role', 'alert');
      availableUsername = '';
    } finally {
      checkUsernameButton.disabled = false;
    }
  });

  usernameInput.addEventListener('input', () => {
    availableUsername = '';
    usernameStatus.textContent = '';
  });

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    signupError.textContent = '';
    const submitButton = signupForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    try {
      const username = usernameInput.value.trim().toLocaleLowerCase('en-US');
      if (availableUsername !== username) {
        throw new Error('아이디 중복확인을 완료해 주세요.');
      }
      await registerAccount({
        name: signupForm.elements.name.value,
        username,
        email: signupForm.elements.email.value,
        password: signupForm.elements.password.value,
      });
      redirectAfterLogin();
    } catch (error) {
      signupError.textContent = getAuthErrorMessage(error);
      submitButton.disabled = false;
    }
  });
}
