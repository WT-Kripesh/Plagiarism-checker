import { IconButton } from "@material-ui/core";
import { AssignmentIndOutlined, FolderOpenOutlined } from "@material-ui/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ClassCard.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc,doc,} from "firebase/firestore";
import {auth,db,} from "./firebase";

function ClassCard({ name, creatorName, id }) {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  
  const goToClass = async () => {
    const classSnapshot = await getDoc(doc(db, "classes", id));
    const classData = classSnapshot.data();
    // {console.log(user.uid ,classData)};
    (user.uid === classData.creatorUid)?
     navigate(`/teacher/${id}`):
      navigate(`/class/${id}`);
  };
  return (
    <div className="classCard" onClick={goToClass}>
      <div className="classCard__upper">
        <div className="classCard__className">{name}</div>
        <div className="classCard__creatorName">{creatorName}</div>
      </div>
      <div className="classCard__middle"></div>
      <div className="classCard__lower">
        <IconButton>
          <FolderOpenOutlined />
        </IconButton>
        <IconButton>
          <AssignmentIndOutlined />
        </IconButton>
      </div>
    </div>
  );
}
export default ClassCard;