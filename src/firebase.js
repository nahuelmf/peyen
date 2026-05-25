import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // <--- IMPORTANTE

const firebaseConfig = {
  apiKey: "AIzaSyARsuXG4Om-bSzR9aaFbkXUYkZgm1DsBO4",
  authDomain: "peyen-de088.firebaseapp.com",
  projectId: "peyen-de088",
  storageBucket: "peyen-de088.firebasestorage.app",
  messagingSenderId: "711412319733",
  appId: "1:711412319733:web:94874413766d200bfe4cbc",
  measurementId: "G-HS6WWBM4GG"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app); // <--- EXPORTA ESTO