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
import { joinDialogAtom } from "./atom";
import {query,getDoc,collection,updateDoc,doc,} from 'firebase/firestore';


function JoinClass() {
    const [open, setOpen] = useRecoilState(joinDialogAtom);
    const [user, loading, error] = useAuthState(auth);
    const [classId, setClassId] = useState("");

    const handleClose = () => {
        setOpen(false);
    };

    const joinClass = async () => {
        try {

            const classRef = doc(db, "classes", classId);
            const classSnapshot = await getDoc(classRef);
            const classData = classSnapshot.data();
            {console.log("1hello",classData)}
            // Add class to user
            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.data() || {};
            const tempClassrooms = userData.enrolledClassrooms || [];
            {console.log("2",tempClassrooms)}
            
            tempClassrooms.push({
                creatorName: classData.creatorName,
                id: classId,
                name: classData.name,
            });
            {console.log("3",tempClassrooms)}

            await updateDoc(userRef, { enrolledClassrooms: tempClassrooms });
    
            alert(`Enrolled in ${classData.name} successfully!`);
            handleClose();
        } catch (err) {
            console.error(err);
            alert(err.message);
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



// const joinClass = async () => {
//     try {
//     // check if class exists
//     const classRef = doc(db, "classes", classId);
//     // if (!classRef.exists) {
//     //     return alert(`Class doesn't exist, please provide correct ID`);
//     // }
//     const classData = (await getDocs(classRef)).data();
//     // add class to user
//     const userRef = query(collection(db, "users"), where("uid", "==", user.uid));
//     const userData = (await getDocs(userRef)).docs[0].data();
//     let tempClassrooms = userData.enrolledClassrooms|| [];
//     tempClassrooms.push({
//         creatorName: classData.creatorName,
//         id: classId,
//         name: classData.name,
//     });
//     console.log("debuging");
//     await (
//         await userRef.get()
//     ).docs[0].ref.update({
//         enrolledClassrooms: tempClassrooms,
//     });
    
    // alert done
//     alert(`Enrolled in ${classData.name} successfully!`);
//     handleClose();
//     } catch (err) {
//     console.log(err);
//     alert(err.message);
//     }
// };