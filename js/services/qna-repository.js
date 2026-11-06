import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { auth, db } from './firebase-config.js';

const COLLECTION_NAME = 'inquiries';
const inquiries = collection(db, COLLECTION_NAME);

function normalizeQuestion(snapshot) {
  return { ...snapshot.data(), id: snapshot.id };
}

function sortQuestions(questions) {
  return questions.sort((first, second) => String(second.createdAt).localeCompare(String(first.createdAt)));
}

export const qnaRepository = {
  async getAll(user, isAdmin) {
    if (isAdmin) {
      const snapshot = await getDocs(inquiries);
      return sortQuestions(snapshot.docs.map(normalizeQuestion));
    }

    const queries = [getDocs(query(inquiries, where('isPrivate', '==', false)))];
    if (user) {
      queries.push(getDocs(query(inquiries, where('authorId', '==', user.uid))));
    }
    const snapshots = await Promise.all(queries);
    const questions = new Map();
    snapshots.forEach((snapshot) => snapshot.docs.forEach((item) => {
      questions.set(item.id, normalizeQuestion(item));
    }));
    return sortQuestions([...questions.values()]);
  },

  async getById(id) {
    const snapshot = await getDoc(doc(db, COLLECTION_NAME, id));
    return snapshot.exists() ? normalizeQuestion(snapshot) : null;
  },

  async create(input) {
    const user = auth.currentUser;
    if (!user) throw new Error('질문을 작성하려면 로그인해 주세요.');
    const now = new Date().toISOString();
    const question = {
      ...input,
      authorId: user.uid,
      answer: '',
      answeredAt: '',
      answeredBy: '',
      createdAt: now,
      updatedAt: now,
    };
    const snapshot = await addDoc(inquiries, question);
    return { ...question, id: snapshot.id };
  },

  async update(id, input) {
    const user = auth.currentUser;
    if (!user) throw new Error('질문을 수정하려면 로그인해 주세요.');
    const reference = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(reference);
    if (!snapshot.exists()) throw new Error('수정할 질문을 찾을 수 없습니다.');
    if (snapshot.data().authorId !== user.uid) throw new Error('본인이 작성한 질문만 수정할 수 있습니다.');

    const update = { ...input, updatedAt: new Date().toISOString() };
    await updateDoc(reference, update);
    return { ...normalizeQuestion(snapshot), ...update };
  },

  async answer(id, answer) {
    const user = auth.currentUser;
    if (!user) throw new Error('관리자 계정으로 로그인해 주세요.');
    const reference = doc(db, COLLECTION_NAME, id);
    const update = {
      answer,
      answeredAt: new Date().toISOString(),
      answeredBy: user.uid,
    };
    await updateDoc(reference, update);
  },

  async remove(id) {
    const user = auth.currentUser;
    if (!user) throw new Error('질문을 삭제하려면 로그인해 주세요.');
    const reference = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(reference);
    if (!snapshot.exists()) throw new Error('삭제할 질문을 찾을 수 없습니다.');
    if (snapshot.data().authorId !== user.uid) throw new Error('본인이 작성한 질문만 삭제할 수 있습니다.');
    await deleteDoc(reference);
  },
};
