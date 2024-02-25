import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { auth, db } from "./firebase";
import { createDialogAtom } from "./atom";
import { addDoc,query,updateDoc,doc, getDocs,collection,where, } from "firebase/firestore";


function CreateClass() {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useRecoilState(createDialogAtom);
  const [className, setClassName] = useState("");
  const [errmsg,seterrmsg] = useState("");
  const handleClose = () => {
    setOpen(false);
  };
  const createClass = async () => {
    try {
      const newClass = await addDoc(collection(db,"classes"),{
        creatorUid: user.uid,
        name: className,
        creatorName: user.displayName,
        posts: [],
      });

      // add to current user's class list
      const userRef = await getDocs(
        query(collection(db, "users"), where("uid", "==", user.uid))
      );
      if (!userRef.empty) {
        const docId = userRef.docs[0].id;
        const userData = userRef.docs[0].data();
        let userClasses = userData.enrolledClassrooms || [];
        userClasses.push({
          id: newClass.id,
          name: className,
          creatorName: user.displayName,
        });
        await updateDoc(doc(db, "users", docId), {
          enrolledClassrooms: userClasses,
        });
      } else {
        console.error("User document not found");
      }      
      console.log("Classroom created successfully!");
      handleClose();
    } catch (err) {
      alert(`Cannot create class - ${err.message}`);
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create class</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of class and we will create a classroom for you!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Class Name"
            type="text"
            fullWidth
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createClass} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default CreateClass;