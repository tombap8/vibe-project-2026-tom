import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDlt8eAe-c1ohDEoWJJlrhZE4d1a3xc410',
  authDomain: 'tom-web-project.firebaseapp.com',
  projectId: 'tom-web-project',
  storageBucket: 'tom-web-project.firebasestorage.app',
  messagingSenderId: '760687126953',
  appId: '1:760687126953:web:e93e6d298dd88eb46bbcb8',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
