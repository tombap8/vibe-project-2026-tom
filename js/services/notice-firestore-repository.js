import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
  writeBatch,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { db } from './firebase-config.js';
import { createLocalStorageNoticeRepository } from './notice-local-storage-repository.js';

const COLLECTION_NAME = 'notices';
const INITIALIZATION_DOCUMENT = ['notice_meta', 'initialization'];
const postsCollection = collection(db, COLLECTION_NAME);
const initializationDocument = doc(db, ...INITIALIZATION_DOCUMENT);
const localRepository = createLocalStorageNoticeRepository();

let initializationPromise;

function normalizePost(snapshot) {
  const data = snapshot.data();
  return {
    ...data,
    id: snapshot.id,
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
    pinned: Boolean(data.pinned),
    views: Number(data.views ?? 0),
  };
}

async function writePostsInBatches(posts) {
  for (let start = 0; start < posts.length; start += 500) {
    const batch = writeBatch(db);
    posts.slice(start, start + 500).forEach((post) => {
      const { id, ...data } = post;
      batch.set(doc(db, COLLECTION_NAME, id), data);
    });
    await batch.commit();
  }
}

async function initializeFirestore() {
  const initialized = await getDoc(initializationDocument);
  if (initialized.exists()) return;

  const existingPosts = await getDocs(postsCollection);
  if (existingPosts.empty) {
    const localPosts = await localRepository.getAll();
    await writePostsInBatches(localPosts);
  }

  await setDoc(initializationDocument, { completedAt: new Date().toISOString() });
}

function ensureInitialized() {
  if (!initializationPromise) {
    initializationPromise = initializeFirestore().catch((error) => {
      initializationPromise = undefined;
      throw error;
    });
  }
  return initializationPromise;
}

async function fetchPosts() {
  await ensureInitialized();
  const snapshot = await getDocs(postsCollection);
  return snapshot.docs
    .map(normalizePost)
    .sort((first, second) => Number(second.pinned) - Number(first.pinned)
      || String(second.createdAt).localeCompare(String(first.createdAt)));
}

export function createFirestoreNoticeRepository() {
  return {
    async getAll() {
      return fetchPosts();
    },

    async getById(id) {
      await ensureInitialized();
      const snapshot = await getDoc(doc(db, COLLECTION_NAME, id));
      return snapshot.exists() ? normalizePost(snapshot) : null;
    },

    async create(input) {
      const posts = await fetchPosts();
      const now = new Date().toISOString();
      const post = {
        ...input,
        number: Math.max(0, ...posts.map((item) => item.number ?? 0)) + 1,
        views: 0,
        createdAt: now,
        updatedAt: now,
      };
      const snapshot = await addDoc(postsCollection, post);
      return { ...post, id: snapshot.id };
    },

    async update(id, input, refreshUpdatedAt = true) {
      await ensureInitialized();
      const reference = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) throw new Error('수정할 공지사항을 찾을 수 없습니다.');

      const existing = normalizePost(snapshot);
      const update = {
        ...input,
        ...(refreshUpdatedAt ? { updatedAt: new Date().toISOString() } : {}),
      };
      await updateDoc(reference, update);

      const retainedStorageIds = new Set(input.attachments.map((file) => file.storageId).filter(Boolean));
      const removedStorageIds = existing.attachments
        .map((file) => file.storageId)
        .filter((storageId) => storageId && !retainedStorageIds.has(storageId));
      await Promise.all(removedStorageIds.map((storageId) => localRepository.removeAttachment(storageId)));

      return { ...existing, ...update };
    },

    async remove(id) {
      await ensureInitialized();
      const reference = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) throw new Error('삭제할 공지사항을 찾을 수 없습니다.');

      const post = normalizePost(snapshot);
      await deleteDoc(reference);
      await Promise.all(post.attachments.map((file) => (
        file.storageId ? localRepository.removeAttachment(file.storageId) : undefined
      )));
    },

    async incrementViews(id) {
      await ensureInitialized();
      const reference = doc(db, COLLECTION_NAME, id);
      await updateDoc(reference, { views: increment(1) });
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) throw new Error('조회할 공지사항을 찾을 수 없습니다.');
      return normalizePost(snapshot);
    },

    saveAttachment(file) {
      return localRepository.saveAttachment(file);
    },

    getAttachment(storageId) {
      return localRepository.getAttachment(storageId);
    },

    removeAttachment(storageId) {
      return localRepository.removeAttachment(storageId);
    },
  };
}
