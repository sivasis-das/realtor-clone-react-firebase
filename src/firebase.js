// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwZ5w0j_9l2OcQFO7vvrvgZ1kQ1AFb_IY",
  authDomain: "realtor-clone-reactjs-2a908.firebaseapp.com",
  projectId: "realtor-clone-reactjs-2a908",
  storageBucket: "realtor-clone-reactjs-2a908.appspot.com",
  messagingSenderId: "1066950583200",
  appId: "1:1066950583200:web:5d83984efe2330a04fbac5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
