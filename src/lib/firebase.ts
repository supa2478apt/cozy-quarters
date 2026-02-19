// Firebase configuration
// Replace the values below with your Firebase project configuration
// You can find these in: Firebase Console → Project Settings → General → Your apps

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDysjzKO3lQB6FTlRBUkYCThdxP9ptNcxQ",
  authDomain: "apartment-management-sys-7ea01.firebaseapp.com",
  projectId: "apartment-management-sys-7ea01",
  storageBucket: "apartment-management-sys-7ea01.firebasestorage.app",
  messagingSenderId: "131824617998",
  appId: "1:131824617998:web:0d51c0c36f13be3cef8a5f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
