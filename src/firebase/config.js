
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics"; 

const firebaseConfig = {
  apiKey: "AIzaSyCFU4SXhqb7bhyHwlP3MNYvv2gdWVbpGzw",
  authDomain: "upsex-5de63.firebaseapp.com",
  projectId: "upsex-5de63",
  storageBucket: "upsex-5de63.firebasestorage.app",
  messagingSenderId: "751014572892",
  appId: "1:751014572892:web:823f740daa271871ca0799",
  measurementId: "G-PP1VM6HX4P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

export { auth, db, storage };
