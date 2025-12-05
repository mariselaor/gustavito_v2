import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDN4uVRs14ZWwiAg_MVYJtHah6tHGEvkSU",
  authDomain: "gustavito-e5bde.firebaseapp.com",
  projectId: "gustavito-e5bde",
  storageBucket: "gustavito-e5bde.firebasestorage.app",
  messagingSenderId: "899095820054",
  appId: "1:899095820054:web:1dc134208420f6edfa4237"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);