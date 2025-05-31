/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { collection, getCountFromServer, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
  // const firebaseConfig = {
  //   apiKey: "AIzaSyDyaaWWgzpYVp-WtvZ7reJwna1m_q3yM2c",
  //   authDomain: "naveedbts-acffa.firebaseapp.com",
  //   projectId: "naveedbts-acffa",
  //   storageBucket: "naveedbts-acffa.firebasestorage.app",
  //   messagingSenderId: "375849808121",
  //   appId: "1:375849808121:web:dd1e542101de7996f73228",
  //   measurementId: "G-BDGTWDJK3S"
  // };

const firebaseConfig = {
  apiKey: "AIzaSyBVA38gfo0p1YlyZaq5FwRTYeIj2MNt81w",
  authDomain: "sonic-express-93c85.firebaseapp.com",
  projectId: "sonic-express-93c85",
  storageBucket: "sonic-express-93c85.firebasestorage.app",
  messagingSenderId: "690119339871",
  appId: "1:690119339871:web:4c3f88c1bafdebc10510ea"
};
//   const firebaseConfig = {
//   apiKey: "AIzaSyACP6zBZ_YjSrobzDLIrDSHMdT7bvSNx-s",
//   authDomain: "btsproject-5d6e0.firebaseapp.com",
//   projectId: "btsproject-5d6e0",
//   storageBucket: "btsproject-5d6e0.firebasestorage.app",
//   messagingSenderId: "32656532061",
//   appId: "1:32656532061:web:1cd6648fbced591d76a3b4",
//   measurementId: "G-F5FVSEJEX5"
// };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const fireStore = getFirestore(app);

const getTotalCount = async (collectionName) => {
  // const coll = collection(fireStore, collectionName);
  const snapshot = await getCountFromServer(collectionName);
  return snapshot.data().count;
};

export { analytics , auth ,fireStore, getTotalCount };