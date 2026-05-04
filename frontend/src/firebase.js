import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace with your Firebase project config
// Get this from Firebase Console → Project Settings → Your apps → Web app
const firebaseConfig = { 
  apiKey : "AIzaSyDFGBT1EN52QmmrfQUDhjpOKxznZM9o_Bc" , 
  authDomain : "test-f2a71.firebaseapp.com" , 
  databaseURL : "https://test-f2a71-default-rtdb.firebaseio.com" , 
  projectId : "test-f2a71" , 
  storageBucket : "test-f2a71.firebasestorage.app" , 
  messagingSenderId : "564485928869" , 
  appId : "1:564485928869:web:088a235ac99c60f5c85a4c" 
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
