
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDgcLTz6Eg5GgJzqOM4zZ5a1vIghggq-d4",
    authDomain: "notes-app-46dd2.firebaseapp.com",
    projectId: "notes-app-46dd2",
    storageBucket: "notes-app-46dd2.appspot.com",
    messagingSenderId: "259163457872",
    appId: "1:259163457872:web:d3774c56cd0f20534d0455"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "Notes")