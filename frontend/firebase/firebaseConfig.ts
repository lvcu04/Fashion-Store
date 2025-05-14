// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7HC7vsgpQIlS9F284hXzTqjlT4LGb6Nk",
  authDomain: "clothing-app-c5bfe.firebaseapp.com",
  projectId: "clothing-app-c5bfe",
  storageBucket: "clothing-app-c5bfe.firebasestorage.app",
  messagingSenderId: "183454743786",
  appId: "1:183454743786:web:3494fb2c677d196f596b93",
  measurementId: "G-2GPKTDJQ0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

