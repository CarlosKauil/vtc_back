// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCer0I4k7UypeOv0IqqDyusTSxJirZQhyc",
  authDomain: "auth-vartica.firebaseapp.com",
  projectId: "auth-vartica",
  storageBucket: "auth-vartica.firebasestorage.com",
  messagingSenderId: "831930262185",
  appId: "1:831930262185:web:839eaf63f470f295bdffb8",
  measurementId: "G-YE3JXTBXPB"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
