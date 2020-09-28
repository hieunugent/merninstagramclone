import firebase from "firebase"
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbZaTdMhD78aWTqdiPhuBuicr5tAf5Qtk",
  authDomain: "instagramclone-49426.firebaseapp.com",
  databaseURL: "https://instagramclone-49426.firebaseio.com",
  projectId: "instagramclone-49426",
  storageBucket: "instagramclone-49426.appspot.com",
  messagingSenderId: "521380547758",
  appId: "1:521380547758:web:15402cc4dddba01e27713f",
  measurementId: "G-NQ3E71Y4EV"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export {db, auth, storage};