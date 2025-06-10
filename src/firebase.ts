import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Importa getAuth
import { getAnalytics } from "firebase/analytics"; // Importa getAnalytics

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 apiKey: "AIzaSyAR2pskltAbLga0-RXGV9iO4iv4xeLKTaI",
 authDomain: "asados-dedd8.firebaseapp.com",
 projectId: "asados-dedd8",
 storageBucket: "asados-dedd8.firebasestorage.app",
 messagingSenderId: "1055886905209",
 appId: "1:1055886905209:web:ef89561c3104a8f7d769a8",
 measurementId: "G-QTPYQHG84J" // Optional: for Firebase Analytics
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app); // Inicializa Authentication
// Initialize Firebase Analytics
const analytics = getAnalytics(app); // Inicializa Analytics

// Export the initialized app and services
export { app, db, auth, analytics }; // Exporta 'auth' y 'analytics' junto con 'app' y 'db'
