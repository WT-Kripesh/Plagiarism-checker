import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
import { getStorage, ref, listAll, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYoANYkWlSA5W3zoK0Rqq93EgZpzm_0cg",
  authDomain: "classroom-minor.firebaseapp.com",
  projectId: "classroom-minor",
  storageBucket: "classroom-minor.appspot.com",
  messagingSenderId: "39481730582",
  appId: "1:39481730582:web:c9ec31b0107b6bac177737",
  measurementId: "G-QFYFD4VEY6",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

const listFilesAndDirectories = async (directory) => {
  try {
    const listRef = ref(storage, directory);
    const result = await listAll(listRef);
    return result;
  } catch (error) {
    console.error("Error listing files and directories:", error);
    throw error;
  }
};

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
const logInWithEmailAndPassword = async (email, password, setLoginError) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    setLoginError("Invalid email or password");
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

const logout = () => {
  signOut(auth);
};
const uploadFileToStorage = async (file, userId) => {
  try {
    const storageRef = ref(storage, `files/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    console.log("File uploaded successfully!");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
// const uploadFileToStorage = (file, authorId) => {
//   const storageRef = ref(storage, `files/${authorId}/${file.name}`);
//   const uploadTask = uploadBytesResumable(storageRef, file);

//   return uploadTask;
// };
export {
  app,
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  uploadFileToStorage,
  listFilesAndDirectories,
};
