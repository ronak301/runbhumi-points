import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAm2y68qckvakkgscEAiSGvXNDcH2s0cc0",
  authDomain: "turf-a98ab.firebaseapp.com",
  databaseURL:
    "https://turf-a98ab-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "turf-a98ab",
  storageBucket: "turf-a98ab.appspot.com",
  messagingSenderId: "349736518905",
  appId: "1:349736518905:web:26423c6319eae375fb8e28",
  measurementId: "G-049D1F43XH",
};

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
