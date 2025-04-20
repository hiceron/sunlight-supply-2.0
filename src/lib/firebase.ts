import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC9ky6IyHdpL2q32ZPMx41vRpOZ56iVvz8",
  authDomain: "sunlightsupplythailand.firebaseapp.com",
  projectId: "sunlightsupplythailand",
  storageBucket: "sunlightsupplythailand.firebasestorage.app",
  messagingSenderId: "138282761948",
  appId: "1:138282761948:web:99e8362bdd3e01c26b3e19",
  measurementId: "G-N7M41Y4R2X",
  databaseURL: "https://sunlightsupplythailand-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const firestore = getFirestore(app);

export const ADMIN_UID = "tTOiA4MMQWW64CS8LgIEZKWT4Bt2";