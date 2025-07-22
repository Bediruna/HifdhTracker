// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj7QO3qaXkprz-VfnDNJMPOU2YwjE-zsc",
  authDomain: "hifdh-tracker-ayl2c.firebaseapp.com",
  projectId: "hifdh-tracker-ayl2c",
  storageBucket: "hifdh-tracker-ayl2c.firebasestorage.app",
  messagingSenderId: "408181902601",
  appId: "1:408181902601:web:2d70755c2a8e3258e217d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
