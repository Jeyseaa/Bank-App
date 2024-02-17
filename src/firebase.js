// firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAVCDxKUgRKYaIv9H2vDJRhITgEVfIHLnk",
  authDomain: "bankcraft-770f3.firebaseapp.com",
  projectId: "bankcraft-770f3",
  storageBucket: "bankcraft-770f3.appspot.com",
  messagingSenderId: "955358093208",
  appId: "1:955358093208:web:0ab4a0833eccc429ed55ed"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, firestore };
