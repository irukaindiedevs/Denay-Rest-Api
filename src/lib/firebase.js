import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // ✅ Realtime DB

const firebaseConfig = {
  apiKey: "AIzaSyAuVjZuQ6jbV_X3C5Jv9AM6bwsGFiSkyGw",
  authDomain: "restapidenay.firebaseapp.com",
  databaseURL:
    "https://restapidenay-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "restapidenay",
  storageBucket: "restapidenay.firebasestorage.app",
  messagingSenderId: "756454769700",
  appId: "1:756454769700:web:f6023911eb1926576884b1",
  measurementId: "G-K1E9JT6BQG",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const database = getDatabase(app);
