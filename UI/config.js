import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyAPeg2H30lKH8xpUnXW3ZFV9Ig0vCZQIwI",
    authDomain: "hanaplingkod-94543.firebaseapp.com",
    projectId: "hanaplingkod-94543",
    storageBucket: "hanaplingkod-94543.appspot.com",
    messagingSenderId: "332235407769",
    appId: "1:332235407769:web:3e709e9636a223ab0c5308",
    measurementId: "G-XZ0T5JMC17"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}