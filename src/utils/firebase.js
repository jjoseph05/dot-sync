// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj95TOCopic-es3O9XV0zM95g9moNL_qI",
  authDomain: "dot-sync-82838.firebaseapp.com",
  databaseURL: "https://dot-sync-82838-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dot-sync-82838",
  storageBucket: "dot-sync-82838.appspot.com",
  messagingSenderId: "556254892037",
  appId: "1:556254892037:web:e5d3f77b0fe1d00b044c6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const dbRef = ref(database);
const getTestCoords = () => {
  get(child(dbRef, `users/john`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}


export { getTestCoords };