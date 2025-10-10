// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqfxvhWMkSTB1WgBS1XIM3FR20RzjFWWk",
  authDomain: "pharma-23154.firebaseapp.com",
  projectId: "pharma-23154",
  storageBucket: "pharma-23154.firebasestorage.app",
  messagingSenderId: "811468302509",
  appId: "1:811468302509:web:f1a23f0bc3d2aadb66fe24",
  measurementId: "G-51RY00T91Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: Only if you need analytics
// export const analytics = getAnalytics(app);