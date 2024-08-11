// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "react-chat-be04c.firebaseapp.com",
  projectId: "react-chat-be04c",
  storageBucket: "react-chat-be04c.appspot.com",
  messagingSenderId: "1075948571106",
  appId: "1:1075948571106:web:e82733e0bc6d0d2aed91bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);