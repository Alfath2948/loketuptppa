import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCKMhGQstbrUh4MiHRugqygWtkgg0MpnnE",
    authDomain: "loket-upt-ppa.firebaseapp.com",
    projectId: "loket-upt-ppa",
    storageBucket: "loket-upt-ppa.firebasestorage.app",
    messagingSenderId: "622225873438",
    appId: "1:622225873438:web:ac1ffeb6ac4446ef9d6c0f",
    measurementId: "G-93Q0Z51V2C"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
