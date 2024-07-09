// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "quiz-app-1293c.firebaseapp.com",
  projectId: "quiz-app-1293c",
  storageBucket: "quiz-app-1293c.appspot.com",
  messagingSenderId: "473498012001",
  appId: "1:473498012001:web:3550d8df9d2392e93f5d20",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
