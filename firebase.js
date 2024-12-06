// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVbIM63ui9-D-SjnxjhlhaGoxwC4mXEyU",
  authDomain: "wingscafeapp.firebaseapp.com",
  databaseURL: "https://wingscafeapp-default-rtdb.firebaseio.com",
  projectId: "wingscafeapp",
  storageBucket: "wingscafeapp.firebasestorage.app",
  messagingSenderId: "533774054335",
  appId: "1:533774054335:web:cfc3ad4e5b2951beaee70a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
module.exports = {db,auth}
