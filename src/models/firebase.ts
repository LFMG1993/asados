// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAR2pskltAbLga0-RXGV9iO4iv4xeLKTaI",
    authDomain: "asados-dedd8.firebaseapp.com",
    projectId: "asados-dedd8",
    storageBucket: "asados-dedd8.firebasestorage.app",
    messagingSenderId: "1055886905209",
    appId: "1:1055886905209:web:ef89561c3104a8f7d769a8",
    measurementId: "G-QTPYQHG84J"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = initializeApp(firebaseConfig);