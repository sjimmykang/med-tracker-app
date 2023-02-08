// JS holding firebase info

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvZ0fN9EcFQYZ1o3lGtgMN_2DQ5yL2mw0",
    authDomain: "med-tracker-33f35.firebaseapp.com",
    databaseURL: "https://med-tracker-33f35-default-rtdb.firebaseio.com",
    projectId: "med-tracker-33f35",
    storageBucket: "med-tracker-33f35.appspot.com",
    messagingSenderId: "646894699689",
    appId: "1:646894699689:web:2eaeaccd95cc78a23d55b8"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;

