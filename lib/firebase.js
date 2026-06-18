import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBm2OEUeKBGu0dk4xRs9d6LKFYIdgeQ780",
  authDomain: "compra-tu-casa-rd.firebaseapp.com",
  projectId: "compra-tu-casa-rd",
  storageBucket: "compra-tu-casa-rd.firebasestorage.app",
  messagingSenderId: "711376638756",
  appId: "1:711376638756:web:23955029b5459e068fd9b1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);