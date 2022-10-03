import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANQMk6c8CkeA8KHSqFHy9Cpe9DmtPCGTA",
  authDomain: "project-f-1363a.firebaseapp.com",
  projectId: "project-f-1363a",
  storageBucket: "project-f-1363a.appspot.com",
  messagingSenderId: "339134265002",
  appId: "1:339134265002:web:285e5457073ff2404802d3",
  measurementId: "G-E74F5H00EW",
};

// Firebaseアプリオブジェクトを初期化
const app = initializeApp(firebaseConfig);
// Firestoreを読み込み、db(databaseの略)として export
export const db = getFirestore(app);
