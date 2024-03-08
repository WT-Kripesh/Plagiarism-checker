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
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { auth, db } from "./firebase";
import { joinDialogAtom } from "./atom";
import {query,getDoc,getDocs,where,collection,updateDoc,doc,} from 'firebase/firestore';


function JoinClass() {
    const [open, setOpen] = useRecoilState(joinDialogAtom);
    const [user] = useAuthState(auth);
    const [classId, setClassId] = useState("");
    const navigate=useNavigate();

    const handleClose = () => {
        setOpen(false);
        // window.location.reload();
        navigate("/");
    };

    const joinClass = async () => {
        try {
            const classRef = doc(db, "classes", classId);   
            const classSnapshot = await getDoc(classRef);
            
            if (!classSnapshot.exists()) {
                return alert(`Class doesn't exist, please provide correct ID`);
            }
    
            const classData = classSnapshot.data(); 
            console.log("class data fetched",classData)
            // Get user document reference

            const userRef = await getDocs(
            query(collection(db, "users"), where("uid", "==", user.uid))
            );
            if (userRef.empty) {
                throw new Error("User not found");
            }

            const docId = userRef.docs[0].id;
            const userData = userRef.docs[0].data();
            console.log("user data fetched",userData.enrolledClassrooms);
            let tempClassrooms = userData.enrolledClassrooms || [];
            
            const alreadyEnrolled = tempClassrooms.some(classroom => classroom.id === classId);
            if (alreadyEnrolled) {
                return alert(`You are already enrolled in ${classData.name}`);
            }
            tempClassrooms.push({
                creatorName: classData.creatorName,
                id: classId,
                name: classData.name,
            });
            // {console.log("user data after pushing new class",userData.enrolledClassrooms)}
    
            // await updateDoc(userRef, { enrolledClassrooms: tempClassrooms });
            await updateDoc(doc(db, "users", docId), {
                enrolledClassrooms: tempClassrooms,
              });
            alert(`Enrolled in ${classData.name} successfully!`);
            handleClose();
        } catch (err) {
            console.error(err);
            alert(err.message);
            handleClose();
        }
    };    
    
    return (
        <div className="joinClass">
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Join class</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter ID of the class to join the classroom
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Class Name"
                        type="text"
                        fullWidth
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={joinClass} color="primary">
                        Join
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default JoinClass;



