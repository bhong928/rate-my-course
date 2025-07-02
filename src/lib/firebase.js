// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJhex1vfEZ0G7Kj3r3hitbml7BxrWudws",
  authDomain: "ratemycourse-b21f2.firebaseapp.com",
  projectId: "ratemycourse-b21f2",
  storageBucket: "ratemycourse-b21f2.firebasestorage.app",
  messagingSenderId: "782164801746",
  appId: "1:782164801746:web:4742b0e116b09e45dcd50b",
  measurementId: "G-TG73KWVJVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };