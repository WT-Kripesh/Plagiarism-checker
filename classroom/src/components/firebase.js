import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBYoANYkWlSA5W3zoK0Rqq93EgZpzm_0cg",
    authDomain: "classroom-minor.firebaseapp.com",
    projectId: "classroom-minor",
    storageBucket: "classroom-minor.appspot.com",
    messagingSenderId: "39481730582",
    appId: "1:39481730582:web:c9ec31b0107b6bac177737",
    measurementId: "G-QFYFD4VEY6"
  };
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();

// Sign in and check or create account in firestore
const signInWithGoogle = async () => {
  try {
    const response = await auth.signInWithRedirect(googleProvider);
    console.log(response.user);
    const user = response.user;
    console.log(`User ID - ${user.uid}`);
    const querySnapshot = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (querySnapshot.docs.length === 0) {
      // create a new user
      await db.collection("users").add({
        uid: user.uid,
        enrolledClassrooms: [],
      });
    }
  } catch (err) {
    alert(err.message);
  }
};

const Logout = () => {
  auth.signOut();
};

export { app, auth, db, signInWithGoogle, Logout };