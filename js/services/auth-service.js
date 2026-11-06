import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
  doc,
  getDoc,
  runTransaction,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { auth, db } from './firebase-config.js';

const USERNAMES_COLLECTION = 'usernames';
const USERS_COLLECTION = 'users';

export function normalizeUsername(username) {
  return username.trim().toLocaleLowerCase('en-US');
}

export async function checkUsernameAvailability(username) {
  const normalizedUsername = normalizeUsername(username);
  if (!/^[a-z0-9._-]{3,20}$/.test(normalizedUsername)) {
    throw new Error('아이디는 영문 소문자, 숫자, 마침표, 밑줄, 하이픈으로 3~20자 입력해 주세요.');
  }
  const snapshot = await getDoc(doc(db, USERNAMES_COLLECTION, normalizedUsername));
  return !snapshot.exists();
}

export async function getUserProfile(user) {
  if (!user) return null;
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, user.uid));
  return snapshot.exists() ? { uid: snapshot.id, ...snapshot.data() } : null;
}

function waitForAuthState() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

export async function getCurrentAuthSession() {
  const user = await waitForAuthState();
  return { user, profile: await getUserProfile(user) };
}

export function subscribeAuthState(callback, onError) {
  return onAuthStateChanged(auth, async (user) => {
    try {
      callback({ user, profile: await getUserProfile(user) });
    } catch (error) {
      onError?.(error);
      callback({ user, profile: null, error });
    }
  }, onError);
}

export async function registerAccount({ name, username, email, password }) {
  const normalizedUsername = normalizeUsername(username);
  const normalizedName = name.trim();
  if (!/^[a-z0-9._-]{3,20}$/.test(normalizedUsername)) {
    throw new Error('아이디는 영문 소문자, 숫자, 마침표, 밑줄, 하이픈으로 3~20자 입력해 주세요.');
  }
  if (!normalizedName) throw new Error('이름을 입력해 주세요.');
  if (password.length < 6) throw new Error('비밀번호는 6자 이상 입력해 주세요.');

  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  try {
    await updateProfile(credential.user, { displayName: normalizedName });
    await runTransaction(db, async (transaction) => {
      const usernameReference = doc(db, USERNAMES_COLLECTION, normalizedUsername);
      const usernameSnapshot = await transaction.get(usernameReference);
      if (usernameSnapshot.exists()) throw new Error('이미 사용 중인 아이디입니다.');

      transaction.set(usernameReference, {
        uid: credential.user.uid,
        email: credential.user.email,
      });
      transaction.set(doc(db, USERS_COLLECTION, credential.user.uid), {
        name: normalizedName,
        username: normalizedUsername,
        email: credential.user.email,
        role: 'user',
        createdAt: new Date().toISOString(),
      });
    });
    return credential.user;
  } catch (error) {
    try {
      await deleteUser(credential.user);
    } catch (cleanupError) {
      throw new Error('회원 정보 저장에 실패했고 인증 계정 정리도 완료하지 못했습니다. Firebase Console에서 계정 상태를 확인해 주세요.', { cause: cleanupError });
    }
    throw error;
  }
}

export async function signInWithUsername(username, password) {
  const normalizedUsername = normalizeUsername(username);
  if (!/^[a-z0-9._-]{3,20}$/.test(normalizedUsername)) {
    throw new Error('아이디 또는 비밀번호를 확인해 주세요.');
  }
  const snapshot = await getDoc(doc(db, USERNAMES_COLLECTION, normalizedUsername));
  if (!snapshot.exists()) throw new Error('아이디 또는 비밀번호를 확인해 주세요.');
  return signInWithEmailAndPassword(auth, snapshot.data().email, password);
}

export function signOutCurrentUser() {
  return signOut(auth);
}

export function getAuthErrorMessage(error) {
  const messages = {
    'auth/email-already-in-use': '이미 가입된 이메일입니다.',
    'auth/invalid-email': '이메일 형식이 올바르지 않습니다.',
    'auth/operation-not-allowed': 'Firebase에서 이메일/비밀번호 로그인이 비활성화되어 있습니다. Firebase Console의 Authentication > 로그인 방법에서 이메일/비밀번호를 사용 설정해 주세요.',
    'auth/invalid-credential': '아이디 또는 비밀번호를 확인해 주세요.',
    'auth/user-not-found': '아이디 또는 비밀번호를 확인해 주세요.',
    'auth/wrong-password': '아이디 또는 비밀번호를 확인해 주세요.',
    'auth/weak-password': '비밀번호는 6자 이상 입력해 주세요.',
    'auth/network-request-failed': 'Firebase 인증 서버에 연결할 수 없습니다. 네트워크와 Firebase 설정을 확인해 주세요.',
    'auth/too-many-requests': '로그인 시도가 많습니다. 잠시 후 다시 시도해 주세요.',
    'permission-denied': 'Firebase 보안 규칙을 확인해 주세요.',
    unavailable: 'Firestore에 연결할 수 없습니다. 인터넷 연결과 Firebase 프로젝트 상태를 확인해 주세요.',
    'failed-precondition': 'Firestore 설정이 완료되지 않았습니다. Firebase Console에서 Firestore Database를 생성했는지 확인해 주세요.',
  };
  return messages[error.code] || error.message || '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
}
