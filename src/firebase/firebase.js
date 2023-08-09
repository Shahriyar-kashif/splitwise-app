import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyALFHZPtzHoAWcRvPNxcOOV8TpePSGEmN0",
    authDomain: "splitwise-app-facc4.firebaseapp.com",
    projectId: "splitwise-app-facc4",
    storageBucket: "splitwise-app-facc4.appspot.com",
    messagingSenderId: "234930113671",
    appId: "1:234930113671:web:2a382ac4291a16d9d3bc22",
    measurementId: "G-6NP8WKS2WH",
};
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
