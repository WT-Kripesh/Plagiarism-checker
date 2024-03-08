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
import { getStorage, ref, listAll, uploadBytes ,getDownloadURL} from "firebase/storage";

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






const uploadFileToStorage = async (file, announcementId) => {
  try {
    const storageRef = ref(storage, `files/${announcementId}/${file.name}`);
    await uploadBytes(storageRef, file);
    console.log("File uploaded successfully!");
  } catch (error) {
    alert("Error uploading file:", error);
  }
};

const listFilesAndDirectories = async (directory) => {
  try {
    const listRef = ref(storage, `files/${directory}`);
    const result = await listAll(listRef);
    return result.items.map(item => item.name); // Extract filenames
  } catch (error) {
    console.error("Error listing files and directories:", error);
    throw error;
  }
  
};
const downloadAll = async (directory) => {
  try {
    const listRef = ref(storage, `files/${directory}`);
    const result = await listAll(listRef);
    const list=result.items.map(item => item.name);

    list.map(async (filename,index) => {
      console.log(`File ${index + 1}: ${filename}`);
      const filesRef = ref(storage, `files/${directory}/${filename}`);
      const downloadURL = await getDownloadURL(filesRef);
      console.log(`Link ${index + 1}: ${downloadURL}`);
    //   downloadURL.forEach(url => {
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.download = url.substring(url.lastIndexOf('/') + 1); // Set the filename
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // });
  });
    
  } catch (error) {
    console.error("Error downloading files:", error);
    // Handle errors
  }
  
  // getDownloadURL(filesRef)
  // .then((url) => {
  //   // Insert url into an <img> tag to "download"
  // })
  // .catch((error) => {
  //   console.log(error.code);
  //   }
  // );
}
async function getAllDownloadURLs(directory) {
  try {
    const listRef = ref(storage, `files/${directory}`);
    const result = await listAll(listRef);
    const list=result.items.map(item => item.name);

    // const urls = await Promise.all(list.map(async (filename) => {
    //   const filesRef = ref(storage, `files/${directory}/${filename}`);
    //   const downloadURL = await getDownloadURL(filesRef);
    //   return { [filename]: downloadURL };
    // }));
    // return urls;
    const downloadLinks = await Promise.all(
      list.map(async (filename) => {
        const filesRef = ref(storage, `files/${directory}/${filename}`);
        const downloadURL = await getDownloadURL(filesRef);
        // console.log(filename,downloadURL);
        return { filename, downloadURL };
      })
    );
    return downloadLinks;

  } catch (error) {
    console.error("Error getting download URLs:", error);
    throw error;
  }
}







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
  downloadAll,
  getAllDownloadURLs,
};
