import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7_Fg7cwOWpHjWWvRJTTCKQuzFbP43FWE",
  authDomain: "socialnetwork-56a3b.firebaseapp.com",
  projectId: "socialnetwork-56a3b",
  storageBucket: "socialnetwork-56a3b.appspot.com",
  messagingSenderId: "636506267348",
  appId: "1:636506267348:web:d07928d6dad86c7a652541",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
