// const firebaseConfig = {
//   apiKey: "AIzaSyBYoANYkWlSA5W3zoK0Rqq93EgZpzm_0cg",
//   authDomain: "classroom-minor.firebaseapp.com",
//   projectId: "classroom-minor",
//   storageBucket: "classroom-minor.appspot.com",
//   messagingSenderId: "39481730582",
//   appId: "1:39481730582:web:c9ec31b0107b6bac177737",
//   measurementId: "G-QFYFD4VEY6"
// };

import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBYoANYkWlSA5W3zoK0Rqq93EgZpzm_0cg",
  authDomain: "classroom-minor.firebaseapp.com",
  projectId: "classroom-minor",
  storageBucket: "classroom-minor.appspot.com",
  messagingSenderId: "39481730582",
  appId: "1:39481730582:web:c9ec31b0107b6bac177737",
  measurementId: "G-QFYFD4VEY6"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};
export {
  app,auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};




// import { initializeApp } from "firebase/app";
// ​​import {GoogleAuthProvider,getAuth,
// ​​  signInWithPopup,
// ​​  signInWithEmailAndPassword,
// ​​  signOut,
// ​​} from "firebase/auth";
// ​​import {
// ​​  getFirestore,
// ​​  collection,
//   addDoc,
// ​​} from "firebase/firestore";

// // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const app = initializeApp(firebaseConfig);
// const auth = getAuth();
// const db = getFirestore();

// const googleProvider = new GoogleAuthProvider();

// // Sign in and check or create account in firestore
// const signInWithGoogle = async () => {
//   try {
//     const response = await signInWithPopup(auth,googleProvider);
//     console.log(response.user);
//     const user = response.user;
//     console.log(`User ID - ${user.uid}`);
//     const querySnapshot = await db
//       .collection("users")
//       .where("uid", "==", user.uid)
//       .get();
//     if (querySnapshot.docs.length === 0) {
//       // create a new user
//       await db.collection("users").add({
//         uid: user.uid,
//         enrolledClassrooms: [],
//       });
//     }
//   } catch (err) {
//     alert(err.message);
//   }
// };
// const logInWithEmailAndPassword = async (email, password) => {
//   try {
//     await signInWithEmailAndPassword(auth, email, password);
//   } catch (err) {
//     console.error(err);
//     alert(err.message);
//   }
// };
// const registerWithEmailAndPassword = async (name, email, password) => {
//   try {
//     const res = await createUserWithEmailAndPassword(auth, email, password);
//     const user = res.user;
//     await addDoc(collection(db, "users"), {
//       uid: user.uid,
//       name,
//       authProvider: "local",
//       email,
//     });
//   } catch (err) {
//     console.error(err);
//     alert(err.message);
//   }
// };
// const sendPasswordReset = async (email) => {
//   try {
//     await sendPasswordResetEmail(auth, email);
//     alert("Password reset link sent!");
//   } catch (err) {
//     console.error(err);
//     alert(err.message);
//   }
// };

// const Logout = () => {
//   signOut(auth);
// };

// export { app, auth, db, signInWithGoogle, Logout };