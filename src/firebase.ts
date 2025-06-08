// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyARHTJzRZ3mgBlzIm4c2vhPN_wAfSxRfcA",
    authDomain: "asados-fff53.firebaseapp.com",
    projectId: "asados-fff53",
    storageBucket: "asados-fff53.firebasestorage.app",
    messagingSenderId: "118832695882",
    appId: "1:118832695882:web:2fb1e56ae6999573ebb4b3",
    measurementId: "G-HVE3CKW02W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = initializeApp(firebaseConfig);