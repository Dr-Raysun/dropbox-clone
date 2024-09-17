// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmF0VtNgfMEqQ9LnUr7DBA-yuJ54lJJIs",
  authDomain: "dropbox-clone-c8fa7.firebaseapp.com",
  projectId: "dropbox-clone-c8fa7",
  storageBucket: "dropbox-clone-c8fa7.appspot.com",
  messagingSenderId: "213187978623",
  appId: "1:213187978623:web:d843d5238f043e38d1e64a",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
export { db, storage, provider, auth };
